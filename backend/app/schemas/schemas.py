from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# Standard health & system status
class HealthResponse(BaseModel):
    status: str
    project: str
    version: str
    timestamp: datetime
    database_connected: bool
    active_stations_count: int
    models_available: bool

# Cities & Stations
class StationBase(BaseModel):
    name: str
    code: str
    latitude: float
    longitude: float
    elevation: Optional[float] = 100.0
    is_active: bool = True

class StationResponse(StationBase):
    id: int
    city_id: int
    city_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class CityResponse(BaseModel):
    id: int
    name: str
    state: str
    country: str
    latitude: float
    longitude: float
    stations: List[StationResponse] = []

    model_config = ConfigDict(from_attributes=True)

# Air Quality Observations
class AirQualityReading(BaseModel):
    timestamp: datetime
    station_id: int
    station_name: Optional[str] = None
    city_name: Optional[str] = None
    aqi: float
    aqi_category: str
    primary_pollutant: Optional[str] = "pm25"
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    so2: Optional[float] = None
    co: Optional[float] = None
    o3: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None
    rainfall: Optional[float] = None
    data_source: Optional[str] = "historical_dataset"

    model_config = ConfigDict(from_attributes=True)

class CurrentAirQualitySummary(BaseModel):
    overall_aqi: float
    overall_category: str
    highest_polluted_station: Optional[Dict[str, Any]] = None
    cleanest_station: Optional[Dict[str, Any]] = None
    readings: List[AirQualityReading] = []
    last_updated: datetime
    active_alerts_count: int

# Historical Summary & Analytics
class HistoricalSummaryPoint(BaseModel):
    period: str # e.g. "2026-10-01" or "2026-W40" or "2026-10"
    avg_aqi: float
    min_aqi: float
    max_aqi: float
    avg_pm25: Optional[float] = None
    avg_pm10: Optional[float] = None
    avg_no2: Optional[float] = None
    sample_count: int

class CorrelationMatrix(BaseModel):
    pollutants: List[str]
    matrix: Dict[str, Dict[str, float]]

class HistoricalAnalyticsResponse(BaseModel):
    city: Optional[str] = None
    station: Optional[str] = None
    total_records: int
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    summary_statistics: Dict[str, Dict[str, float]] # mean, min, max, std for pollutants
    trend_data: List[HistoricalSummaryPoint]
    correlations: Optional[CorrelationMatrix] = None
    seasonal_highs: List[Dict[str, Any]] = []

# Predictions & Forecasts
class ForecastPoint(BaseModel):
    target_time: datetime
    horizon_hours: int
    predicted_aqi: float
    predicted_category: str
    confidence_lower: Optional[float] = None
    confidence_upper: Optional[float] = None
    predicted_pm25: Optional[float] = None
    predicted_pm10: Optional[float] = None

class ForecastResponse(BaseModel):
    station_id: int
    station_name: str
    city_name: str
    generated_at: datetime
    model_version: str
    current_aqi: float
    current_category: str
    forecasts: List[ForecastPoint]
    model_r2: Optional[float] = None
    model_mae: Optional[float] = None
    caveats: str

class ModelTrainRequest(BaseModel):
    model_type: str = Field(default="HistGradientBoosting", description="RandomForest, HistGradientBoosting, or Baseline")
    test_size_ratio: float = Field(default=0.2, ge=0.05, le=0.4)
    target_pollutant: str = Field(default="aqi")

class ModelMetricsResponse(BaseModel):
    model_name: str
    version: str
    trained_at: datetime
    target_variable: str
    train_samples: int
    test_samples: int
    metrics: Dict[str, Any] # r2, mae, rmse, baseline_mae
    features_used: List[str]
    actual_vs_predicted_sample: List[Dict[str, float]]
    is_active: bool

# Alerts
class AlertItem(BaseModel):
    id: int
    station_id: int
    city_name: str
    station_name: str
    severity: str
    alert_type: str
    pollutant: str
    measured_value: float
    threshold_value: float
    message: str
    triggered_at: datetime
    is_acknowledged: bool
    acknowledged_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class AlertSummary(BaseModel):
    total_unread: int
    critical_count: int
    warning_count: int
    recent_alerts: List[AlertItem]

# Map Visualization
class StationMapItem(BaseModel):
    id: int
    name: str
    code: str
    city: str
    latitude: float
    longitude: float
    latest_aqi: float
    category: str
    dominant_pollutant: str
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    temperature: Optional[float] = None
    last_updated: datetime

class MapStationListResponse(BaseModel):
    stations: List[StationMapItem]
    city_centers: Dict[str, Dict[str, float]]
