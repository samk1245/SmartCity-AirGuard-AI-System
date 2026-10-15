import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
import joblib
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from sklearn.dummy import DummyRegressor
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from app.core.config import settings
from app.db.database import SessionLocal
from app.models.models import AirQualityObservation, ModelMetadata, Station
from app.ml.preprocessing import create_engineered_features, chronological_train_test_split, FEATURE_COLUMNS
from app.ml.evaluate import compute_regression_metrics

def train_and_save_model(
    model_type: str = "HistGradientBoosting",
    test_ratio: float = 0.2,
    target_col: str = "aqi"
) -> Dict[str, Any]:
    """
    Trains a high-performance machine learning model on historical observations
    using strict chronological validation and quantiles for confidence bounds.
    """
    db: Session = SessionLocal()
    try:
        # Load observations from DB
        query = db.query(AirQualityObservation).order_by(AirQualityObservation.timestamp.asc())
        data = [
            {
                "timestamp": obs.timestamp,
                "station_id": obs.station_id,
                "aqi": obs.aqi,
                "pm25": obs.pm25,
                "pm10": obs.pm10,
                "no2": obs.no2,
                "so2": obs.so2,
                "co": obs.co,
                "o3": obs.o3,
                "temperature": obs.temperature,
                "humidity": obs.humidity,
                "wind_speed": obs.wind_speed,
                "rainfall": obs.rainfall,
            }
            for obs in query.all()
        ]

        if len(data) < 200:
            raise ValueError(f"Insufficient training observations: found {len(data)}, required at least 200.")

        raw_df = pd.DataFrame(data)
        feat_df = create_engineered_features(raw_df)

        train_df, test_df = chronological_train_test_split(feat_df, test_ratio=test_ratio)

        X_train = train_df[FEATURE_COLUMNS]
        y_train = train_df[target_col]
        X_test = test_df[FEATURE_COLUMNS]
        y_test = test_df[target_col]

        # 1. Baseline Model
        dummy = DummyRegressor(strategy="mean")
        dummy.fit(X_train, y_train)
        dummy_preds = dummy.predict(X_test)

        # 2. Main Selected Model
        if model_type == "RandomForest":
            main_model = RandomForestRegressor(
                n_estimators=100,
                max_depth=16,
                min_samples_split=4,
                n_jobs=-1,
                random_state=42
            )
        else:
            model_type = "HistGradientBoosting"
            main_model = HistGradientBoostingRegressor(
                max_iter=150,
                learning_rate=0.08,
                max_depth=12,
                random_state=42
            )

        main_model.fit(X_train, y_train)
        preds = main_model.predict(X_test)

        # 3. Defensible Quantile Models for Uncertainty / Prediction Intervals
        lower_model = HistGradientBoostingRegressor(
            loss="quantile", quantile=0.10, max_iter=80, max_depth=8, random_state=42
        )
        lower_model.fit(X_train, y_train)

        upper_model = HistGradientBoostingRegressor(
            loss="quantile", quantile=0.90, max_iter=80, max_depth=8, random_state=42
        )
        upper_model.fit(X_train, y_train)

        # Evaluate performance
        metrics = compute_regression_metrics(y_test.values, preds, baseline_pred=dummy_preds)

        # Prepare artifacts bundle
        version_str = f"v_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        model_filename = f"airguard_aqi_model_{version_str}.joblib"
        model_path = os.path.join(settings.MODELS_DIR, model_filename)

        bundle = {
            "version": version_str,
            "model_type": model_type,
            "target": target_col,
            "feature_columns": FEATURE_COLUMNS,
            "main_model": main_model,
            "lower_model": lower_model,
            "upper_model": upper_model,
            "metrics": metrics,
            "trained_at": datetime.utcnow().isoformat(),
        }

        joblib.dump(bundle, model_path)
        print(f"[ML Train] Saved trained model bundle to {model_path}")

        # Update latest model symlink/file
        latest_path = os.path.join(settings.MODELS_DIR, "airguard_latest_model.joblib")
        joblib.dump(bundle, latest_path)

        # Deactivate previous active models in DB
        db.query(ModelMetadata).update({ModelMetadata.is_active: False})

        # Register metadata in DB
        metadata_entry = ModelMetadata(
            model_name=model_type,
            version=version_str,
            target_variable=target_col,
            trained_at=datetime.utcnow(),
            train_samples=len(train_df),
            test_samples=len(test_df),
            metrics_json=json.dumps(metrics),
            features_json=json.dumps(FEATURE_COLUMNS),
            file_path=model_path,
            is_active=True
        )
        db.add(metadata_entry)
        db.commit()

        # Actual vs Predicted comparison sample for evaluation visualization (last 60 points)
        sample_indices = np.linspace(0, len(test_df) - 1, min(60, len(test_df)), dtype=int)
        sample_actual_vs_pred = [
            {
                "timestamp": str(test_df.iloc[idx]["timestamp"]),
                "actual": round(float(y_test.iloc[idx]), 1),
                "predicted": round(float(preds[idx]), 1),
                "lower": round(float(lower_model.predict(X_test.iloc[[idx]])[0]), 1),
                "upper": round(float(upper_model.predict(X_test.iloc[[idx]])[0]), 1),
            }
            for idx in sample_indices
        ]

        return {
            "model_name": model_type,
            "version": version_str,
            "trained_at": datetime.utcnow(),
            "target_variable": target_col,
            "train_samples": len(train_df),
            "test_samples": len(test_df),
            "metrics": metrics,
            "features_used": FEATURE_COLUMNS,
            "actual_vs_predicted_sample": sample_actual_vs_pred,
            "is_active": True
        }

    finally:
        db.close()

if __name__ == "__main__":
    res = train_and_save_model()
    print("[ML Train Result]:", json.dumps(res["metrics"], indent=2))
