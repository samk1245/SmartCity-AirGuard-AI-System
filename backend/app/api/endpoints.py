import os
import json
import io
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.db.database import get_db
from app.models.models import (
    City, Station, AirQualityObservation, ForecastRecord, ModelMetadata, AlertRecord
)
from app.schemas.schemas import (
    HealthResponse, CityResponse, StationResponse,
    CurrentAirQualitySummary, AirQualityReading,
    HistoricalAnalyticsResponse, ForecastResponse,
    ModelTrainRequest, ModelMetricsResponse,
    AlertItem, AlertSummary, MapStationListResponse, StationMapItem
)
from app.services.aqi_calculator import get_aqi_category
from app.services.analytics_service import get_historical_analytics
from app.services.alert_service import get_alerts_list, acknowledge_alert
from app.services.dataset_service import validate_and_import_csv
from app.ml.train import train_and_save_model
from app.ml.predict import generate_forecast, get_latest_model_bundle
from app.core.config import settings

router = APIRouter()

# 1. Health check
@router.get("/health", response_model=HealthResponse, tags=["System"])
def health_check(db: Session = Depends(get_db)):
    active_stations = db.query(Station).filter(Station.is_active == True).count()
    bundle = get_latest_model_bundle()
    return HealthResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        timestamp=datetime.utcnow(),
        database_connected=True,
        active_stations_count=active_stations,
        models_available=(bundle is not None)
    )

# 2. Locations (Cities & Monitoring Stations)
@router.get("/locations", response_model=List[CityResponse], tags=["Locations"])
def get_locations(db: Session = Depends(get_db)):
    cities = db.query(City).all()
    result = []
    for city in cities:
        stations = [
            StationResponse(
                id=st.id,
                city_id=st.city_id,
                city_name=city.name,
                name=st.name,
                code=st.code,
                latitude=st.latitude,
                longitude=st.longitude,
                elevation=st.elevation,
                is_active=st.is_active
            )
            for st in city.stations
        ]
        result.append(
            CityResponse(
                id=city.id,
                name=city.name,
                state=city.state,
                country=city.country,
                latitude=city.latitude,
                longitude=city.longitude,
                stations=stations
            )
        )
    return result

# 3. Current Air Quality Dashboard Overview
@router.get("/air-quality/current", response_model=CurrentAirQualitySummary, tags=["Air Quality"])
def get_current_air_quality(
    city_name: Optional[str] = None,
    station_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Station).filter(Station.is_active == True)
    if city_name:
        query = query.join(City).filter(City.name.ilike(f"%{city_name}%"))
    if station_id:
        query = query.filter(Station.id == station_id)

    stations = query.all()
    if not stations:
        raise HTTPException(status_code=404, detail="No matching stations found.")

    readings: List[AirQualityReading] = []
    for st in stations:
        latest = db.query(AirQualityObservation)\
            .filter(AirQualityObservation.station_id == st.id)\
            .order_by(AirQualityObservation.timestamp.desc())\
            .first()

        if latest:
            readings.append(
                AirQualityReading(
                    timestamp=latest.timestamp,
                    station_id=st.id,
                    station_name=st.name,
                    city_name=st.city.name if st.city else "Unknown",
                    aqi=latest.aqi,
                    aqi_category=latest.aqi_category,
                    primary_pollutant=latest.primary_pollutant,
                    pm25=latest.pm25,
                    pm10=latest.pm10,
                    no2=latest.no2,
                    so2=latest.so2,
                    co=latest.co,
                    o3=latest.o3,
                    temperature=latest.temperature,
                    humidity=latest.humidity,
                    wind_speed=latest.wind_speed,
                    rainfall=latest.rainfall,
                    data_source=latest.data_source
                )
            )

    if not readings:
        raise HTTPException(status_code=404, detail="No current observation records found.")

    avg_aqi = round(sum(r.aqi for r in readings) / len(readings), 1)
    overall_cat = get_aqi_category(avg_aqi)

    highest_station = max(readings, key=lambda r: r.aqi)
    lowest_station = min(readings, key=lambda r: r.aqi)

    unread_alerts = db.query(AlertRecord).filter(AlertRecord.is_acknowledged == False).count()
    latest_update = max(r.timestamp for r in readings)

    return CurrentAirQualitySummary(
        overall_aqi=avg_aqi,
        overall_category=overall_cat,
        highest_polluted_station={
            "station_name": highest_station.station_name,
            "city": highest_station.city_name,
            "aqi": highest_station.aqi,
            "category": highest_station.aqi_category,
            "pollutant": highest_station.primary_pollutant
        },
        cleanest_station={
            "station_name": lowest_station.station_name,
            "city": lowest_station.city_name,
            "aqi": lowest_station.aqi,
            "category": lowest_station.aqi_category
        },
        readings=readings,
        last_updated=latest_update,
        active_alerts_count=unread_alerts
    )

# 4. Historical Trends and Summary Analytics
@router.get("/air-quality/summary", response_model=HistoricalAnalyticsResponse, tags=["Historical Analytics"])
def get_historical_summary(
    station_id: Optional[int] = None,
    city_name: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    aggregation: str = Query("daily", regex="^(hourly|daily|weekly|monthly)$"),
    db: Session = Depends(get_db)
):
    analytics = get_historical_analytics(
        db=db,
        station_id=station_id,
        city_name=city_name,
        start_date=start_date,
        end_date=end_date,
        aggregation=aggregation
    )
    return analytics

# 5. Export Historical Observations to CSV
@router.get("/data/export", tags=["Data Integration"])
def export_historical_csv(
    station_id: Optional[int] = None,
    city_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AirQualityObservation).join(Station)
    if city_name:
        query = query.join(City).filter(City.name.ilike(f"%{city_name}%"))
    if station_id:
        query = query.filter(AirQualityObservation.station_id == station_id)

    records = query.order_by(AirQualityObservation.timestamp.asc()).all()
    if not records:
        raise HTTPException(status_code=404, detail="No observations to export.")

    rows = [
        f"timestamp,city,station,aqi,category,pm25,pm10,no2,so2,co,o3,temperature,humidity,wind_speed\n"
    ]
    for r in records:
        st_name = r.station.name.replace(",", " ")
        c_name = r.station.city.name if r.station.city else "India"
        rows.append(
            f"{r.timestamp.isoformat()},{c_name},{st_name},{r.aqi},{r.aqi_category},"
            f"{r.pm25 or ''},{r.pm10 or ''},{r.no2 or ''},{r.so2 or ''},{r.co or ''},{r.o3 or ''},"
            f"{r.temperature or ''},{r.humidity or ''},{r.wind_speed or ''}\n"
        )

    content = "".join(rows)
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=airguard_historical_export.csv"}
    )

# 6. Upload Dataset CSV
@router.post("/data/upload", tags=["Data Integration"])
async def upload_dataset_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files (.csv) are accepted.")

    content = await file.read()
    if len(content) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 25 MB limit.")

    report = validate_and_import_csv(db=db, file_bytes=content, filename=file.filename)
    return report

# 7. AI Forecasting
@router.post("/predictions/forecast", response_model=ForecastResponse, tags=["Forecasting"])
def forecast_air_quality(
    station_id: int = Query(..., description="Target Monitoring Station ID"),
    horizon_hours: int = Query(24, ge=1, le=72, description="Forecast horizon (1 to 72 hours ahead)"),
    db: Session = Depends(get_db)
):
    try:
        forecast = generate_forecast(station_id=station_id, horizon_hours=horizon_hours, db=db)
        return forecast
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

# 8. Model Training & Retraining
@router.post("/models/train", tags=["Machine Learning"])
def train_model_endpoint(req: ModelTrainRequest, db: Session = Depends(get_db)):
    try:
        result = train_and_save_model(
            model_type=req.model_type,
            test_ratio=req.test_size_ratio,
            target_col=req.target_pollutant
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")

# 9. Model Metrics & Evaluation
@router.get("/models/metrics", tags=["Machine Learning"])
def get_model_metrics(db: Session = Depends(get_db)):
    meta = db.query(ModelMetadata).filter(ModelMetadata.is_active == True).first()
    if not meta:
        raise HTTPException(status_code=404, detail="No active trained model found.")

    metrics = json.loads(meta.metrics_json)
    features = json.loads(meta.features_json)

    # Fetch last 40 actual vs predicted points for evaluation chart
    bundle = get_latest_model_bundle()
    sample_points = []
    if bundle:
        sample_points = bundle.get("actual_vs_predicted_sample", [])

    return {
        "model_name": meta.model_name,
        "version": meta.version,
        "trained_at": meta.trained_at,
        "target_variable": meta.target_variable,
        "train_samples": meta.train_samples,
        "test_samples": meta.test_samples,
        "metrics": metrics,
        "features_used": features,
        "actual_vs_predicted_sample": sample_points,
        "is_active": meta.is_active
    }

# 10. Alerts Center
@router.get("/alerts", response_model=AlertSummary, tags=["Alerts"])
def get_alerts(
    city_name: Optional[str] = None,
    station_id: Optional[int] = None,
    severity: Optional[str] = None,
    is_acknowledged: Optional[bool] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    alerts = get_alerts_list(
        db=db,
        station_id=station_id,
        city_name=city_name,
        severity=severity,
        is_acknowledged=is_acknowledged,
        limit=limit
    )

    unread_count = db.query(AlertRecord).filter(AlertRecord.is_acknowledged == False).count()
    critical_count = db.query(AlertRecord).filter(AlertRecord.severity == "Critical", AlertRecord.is_acknowledged == False).count()
    warning_count = db.query(AlertRecord).filter(AlertRecord.severity == "Warning", AlertRecord.is_acknowledged == False).count()

    return AlertSummary(
        total_unread=unread_count,
        critical_count=critical_count,
        warning_count=warning_count,
        recent_alerts=[AlertItem.model_validate(a) for a in alerts]
    )

@router.patch("/alerts/{alert_id}/acknowledge", response_model=AlertItem, tags=["Alerts"])
def acknowledge_alert_endpoint(alert_id: int, db: Session = Depends(get_db)):
    alert = acknowledge_alert(db=db, alert_id=alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert record not found.")
    return AlertItem.model_validate(alert)

# 11. Interactive Map Stations Endpoint
@router.get("/map/stations", response_model=MapStationListResponse, tags=["Map Visualization"])
def get_map_stations(city_name: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Station).filter(Station.is_active == True)
    if city_name:
        query = query.join(City).filter(City.name.ilike(f"%{city_name}%"))

    stations = query.all()
    map_items: List[StationMapItem] = []
    city_centers: Dict[str, Dict[str, float]] = {
        "Delhi": {"lat": 28.6139, "lng": 77.2090},
        "Lucknow": {"lat": 26.8467, "lng": 80.9462},
        "Prayagraj": {"lat": 25.4358, "lng": 81.8463},
        "Kanpur": {"lat": 26.4499, "lng": 80.3319},
        "Varanasi": {"lat": 25.3176, "lng": 82.9739},
        "Mumbai": {"lat": 19.0760, "lng": 72.8777},
        "Bengaluru": {"lat": 12.9716, "lng": 77.5946},
        "Kolkata": {"lat": 22.5726, "lng": 88.3639},
        "Hyderabad": {"lat": 17.3850, "lng": 78.4867},
        "Ahmedabad": {"lat": 23.0225, "lng": 72.5714},
        "Jaipur": {"lat": 26.9124, "lng": 75.7873},
        "Patna": {"lat": 25.5941, "lng": 85.1376},
        "Agra": {"lat": 27.1767, "lng": 78.0081},
        "Pune": {"lat": 18.5204, "lng": 73.8567},
        "Chandigarh": {"lat": 30.7333, "lng": 76.7794},
    }

    for st in stations:
        latest = db.query(AirQualityObservation)\
            .filter(AirQualityObservation.station_id == st.id)\
            .order_by(AirQualityObservation.timestamp.desc())\
            .first()

        if latest:
            map_items.append(
                StationMapItem(
                    id=st.id,
                    name=st.name,
                    code=st.code,
                    city=st.city.name if st.city else "Unknown",
                    latitude=st.latitude,
                    longitude=st.longitude,
                    latest_aqi=latest.aqi,
                    category=latest.aqi_category,
                    dominant_pollutant=latest.primary_pollutant or "pm25",
                    pm25=latest.pm25,
                    pm10=latest.pm10,
                    no2=latest.no2,
                    temperature=latest.temperature,
                    last_updated=latest.timestamp
                )
            )

    return MapStationListResponse(
        stations=map_items,
        city_centers=city_centers
    )
