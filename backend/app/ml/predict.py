import os
import joblib
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import SessionLocal
from app.models.models import AirQualityObservation, Station, ForecastRecord
from app.services.aqi_calculator import get_aqi_category
from app.ml.preprocessing import FEATURE_COLUMNS

_CACHED_MODEL_BUNDLE = None

def get_latest_model_bundle() -> Optional[Dict[str, Any]]:
    """Loads and caches the active trained model bundle."""
    global _CACHED_MODEL_BUNDLE
    latest_path = os.path.join(settings.MODELS_DIR, "airguard_latest_model.joblib")
    if not os.path.exists(latest_path):
        return None
    try:
        _CACHED_MODEL_BUNDLE = joblib.load(latest_path)
        return _CACHED_MODEL_BUNDLE
    except Exception as e:
        print(f"[ML Predict] Error loading model bundle: {e}")
        return None

def generate_forecast(
    station_id: int, 
    horizon_hours: int = 24,
    db: Session = None
) -> Dict[str, Any]:
    """
    Generates multi-hour forward air quality forecasts using the trained ML model.
    Produces predictions, defensible quantile intervals (10th & 90th percentile),
    and expected CPCB risk categories.
    """
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        station = db.query(Station).filter(Station.id == station_id).first()
        if not station:
            raise ValueError(f"Station with ID {station_id} not found.")

        bundle = get_latest_model_bundle()
        if bundle is None:
            raise RuntimeError("No trained model bundle available. Please train a model first.")

        main_model = bundle["main_model"]
        lower_model = bundle.get("lower_model")
        upper_model = bundle.get("upper_model")
        version_str = bundle.get("version", "v1.0.0")
        metrics = bundle.get("metrics", {})

        # Fetch recent historical observations for context and autoregressive features
        recent_obs = db.query(AirQualityObservation)\
            .filter(AirQualityObservation.station_id == station_id)\
            .order_by(AirQualityObservation.timestamp.desc())\
            .limit(48)\
            .all()

        if not recent_obs or len(recent_obs) < 24:
            raise ValueError(f"Insufficient recent observations ({len(recent_obs)} points found) to compute autoregressive lags.")

        # Reverse to chronological order (oldest to newest)
        recent_obs.reverse()
        latest_obs = recent_obs[-1]
        latest_time = latest_obs.timestamp

        # Check freshness warning
        is_stale = False
        hours_since_latest = (datetime.utcnow() - latest_time).total_seconds() / 3600.0
        if hours_since_latest > 24:
            is_stale = True

        # Build rolling series
        history_aqi = [obs.aqi for obs in recent_obs]
        history_pm25 = [obs.pm25 or (obs.aqi * 0.7) for obs in recent_obs]
        curr_temp = latest_obs.temperature or 26.0
        curr_humidity = latest_obs.humidity or 60.0
        curr_wind = latest_obs.wind_speed or 8.0
        curr_rain = latest_obs.rainfall or 0.0

        forecast_points = []
        forecast_records_to_save = []

        curr_time = latest_time
        aqi_seq = list(history_aqi)
        pm25_seq = list(history_pm25)

        for step in range(1, horizon_hours + 1):
            curr_time = curr_time + timedelta(hours=1)
            hour = curr_time.hour
            month = curr_time.month
            day_of_week = curr_time.weekday()

            # Cyclical time encodings
            hour_sin = np.sin(2 * np.pi * hour / 24.0)
            hour_cos = np.cos(2 * np.pi * hour / 24.0)
            month_sin = np.sin(2 * np.pi * month / 12.0)
            month_cos = np.cos(2 * np.pi * month / 12.0)

            # Autoregressive lags from sequence
            aqi_lag_1 = aqi_seq[-1]
            aqi_lag_6 = aqi_seq[-6] if len(aqi_seq) >= 6 else aqi_seq[-1]
            aqi_lag_12 = aqi_seq[-12] if len(aqi_seq) >= 12 else aqi_seq[-1]
            aqi_lag_24 = aqi_seq[-24] if len(aqi_seq) >= 24 else aqi_seq[-1]

            # Rolling stats over last 6 and 24 points
            aqi_roll_mean_6 = float(np.mean(aqi_seq[-6:]))
            aqi_roll_mean_24 = float(np.mean(aqi_seq[-24:]))
            aqi_roll_std_24 = float(np.std(aqi_seq[-24:]))

            pm25_lag_1 = pm25_seq[-1]
            pm25_lag_24 = pm25_seq[-24] if len(pm25_seq) >= 24 else pm25_seq[-1]

            # Simulated diurnal weather adjustment
            pred_temp = curr_temp + 3.0 * np.sin((hour - 8) * np.pi / 12)
            pred_humidity = curr_humidity - 8.0 * np.sin((hour - 8) * np.pi / 12)

            feature_dict = {
                "hour_sin": hour_sin,
                "hour_cos": hour_cos,
                "month_sin": month_sin,
                "month_cos": month_cos,
                "day_of_week": day_of_week,
                "aqi_lag_1": aqi_lag_1,
                "aqi_lag_6": aqi_lag_6,
                "aqi_lag_12": aqi_lag_12,
                "aqi_lag_24": aqi_lag_24,
                "aqi_roll_mean_6": aqi_roll_mean_6,
                "aqi_roll_mean_24": aqi_roll_mean_24,
                "aqi_roll_std_24": aqi_roll_std_24,
                "pm25_lag_1": pm25_lag_1,
                "pm25_lag_24": pm25_lag_24,
                "temperature": pred_temp,
                "humidity": pred_humidity,
                "wind_speed": curr_wind,
                "rainfall": curr_rain,
                "station_id": station_id
            }

            X_input = pd.DataFrame([feature_dict])[FEATURE_COLUMNS]

            pred_val = float(main_model.predict(X_input)[0])
            pred_val = max(10.0, round(pred_val, 1))

            lower_val = float(lower_model.predict(X_input)[0]) if lower_model else max(5.0, pred_val - 15.0)
            upper_val = float(upper_model.predict(X_input)[0]) if upper_model else pred_val + 20.0
            lower_val = max(5.0, round(lower_val, 1))
            upper_val = max(lower_val, round(upper_val, 1))

            pred_cat = get_aqi_category(pred_val)
            pred_pm25 = round(pred_val * 0.65, 1)
            pred_pm10 = round(pred_val * 1.35, 1)

            # Append for autoregressive feedforward in subsequent hours
            aqi_seq.append(pred_val)
            pm25_seq.append(pred_pm25)

            forecast_point = {
                "target_time": curr_time,
                "horizon_hours": step,
                "predicted_aqi": pred_val,
                "predicted_category": pred_cat,
                "confidence_lower": lower_val,
                "confidence_upper": upper_val,
                "predicted_pm25": pred_pm25,
                "predicted_pm10": pred_pm10,
            }
            forecast_points.append(forecast_point)

            rec = ForecastRecord(
                station_id=station_id,
                generated_at=datetime.utcnow(),
                forecast_target_time=curr_time,
                horizon_hours=step,
                predicted_aqi=pred_val,
                predicted_category=pred_cat,
                confidence_lower=lower_val,
                confidence_upper=upper_val,
                predicted_pm25=pred_pm25,
                predicted_pm10=pred_pm10,
                model_version=version_str
            )
            forecast_records_to_save.append(rec)

        # Batch save to forecast_records
        db.bulk_save_objects(forecast_records_to_save)
        db.commit()

        caveat_text = (
            "Forecasts are machine learning statistical estimations based on historical patterns "
            "and meteorological variables; they do not replace official CPCB/IMD public advisories."
        )
        if is_stale:
            caveat_text += f" Warning: Most recent station observation is {hours_since_latest:.1f} hours old."

        return {
            "station_id": station.id,
            "station_name": station.name,
            "city_name": station.city.name if station.city else "Unknown",
            "generated_at": datetime.utcnow(),
            "model_version": version_str,
            "current_aqi": latest_obs.aqi,
            "current_category": latest_obs.aqi_category,
            "forecasts": forecast_points,
            "model_r2": metrics.get("r2"),
            "model_mae": metrics.get("mae"),
            "caveats": caveat_text
        }

    finally:
        if should_close:
            db.close()
