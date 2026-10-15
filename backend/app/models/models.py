from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Index, Text, UniqueConstraint
)
from sqlalchemy.orm import relationship
from app.db.database import Base

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    state = Column(String(100), nullable=False)
    country = Column(String(50), default="India")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    stations = relationship("Station", back_populates="city", cascade="all, delete-orphan")


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    code = Column(String(50), unique=True, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, default=100.0)
    is_active = Column(Boolean, default=True)

    city = relationship("City", back_populates="stations")
    observations = relationship("AirQualityObservation", back_populates="station", cascade="all, delete-orphan")
    forecasts = relationship("ForecastRecord", back_populates="station", cascade="all, delete-orphan")
    alerts = relationship("AlertRecord", back_populates="station", cascade="all, delete-orphan")


class AirQualityObservation(Base):
    __tablename__ = "air_quality_observations"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("stations.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    
    # Pollutants (in µg/m³, except CO in mg/m³)
    pm25 = Column(Float, nullable=True)
    pm10 = Column(Float, nullable=True)
    no2 = Column(Float, nullable=True)
    so2 = Column(Float, nullable=True)
    co = Column(Float, nullable=True)
    o3 = Column(Float, nullable=True)

    # Composite AQI and category (CPCB standard)
    aqi = Column(Float, nullable=False, index=True)
    aqi_category = Column(String(50), nullable=False) # Good, Satisfactory, Moderate, Poor, Very Poor, Severe
    primary_pollutant = Column(String(20), default="pm25")

    # Meteorological context
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    rainfall = Column(Float, default=0.0)

    # Attribution
    data_source = Column(String(50), default="historical_dataset") # historical_dataset, cpcb, openaq, user_upload

    station = relationship("Station", back_populates="observations")

    __table_args__ = (
        UniqueConstraint("station_id", "timestamp", name="uq_station_timestamp"),
        Index("ix_station_timestamp", "station_id", "timestamp"),
    )


class ForecastRecord(Base):
    __tablename__ = "forecast_records"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("stations.id", ondelete="CASCADE"), nullable=False, index=True)
    generated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    forecast_target_time = Column(DateTime, nullable=False, index=True)
    horizon_hours = Column(Integer, nullable=False)
    
    predicted_aqi = Column(Float, nullable=False)
    predicted_category = Column(String(50), nullable=False)
    confidence_lower = Column(Float, nullable=True)
    confidence_upper = Column(Float, nullable=True)
    
    predicted_pm25 = Column(Float, nullable=True)
    predicted_pm10 = Column(Float, nullable=True)
    model_version = Column(String(50), nullable=False)

    station = relationship("Station", back_populates="forecasts")

    __table_args__ = (
        Index("ix_forecast_station_time", "station_id", "forecast_target_time"),
    )


class ModelMetadata(Base):
    __tablename__ = "model_metadata"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False) # e.g. HistGradientBoostingRegressor
    version = Column(String(50), unique=True, nullable=False)
    target_variable = Column(String(50), default="aqi")
    trained_at = Column(DateTime, default=datetime.utcnow)
    train_samples = Column(Integer, nullable=False)
    test_samples = Column(Integer, nullable=False)
    
    # JSON strings of metrics and parameters
    metrics_json = Column(Text, nullable=False) # mae, rmse, r2, baseline comparison
    features_json = Column(Text, nullable=False) # list of features used
    file_path = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)


class AlertRecord(Base):
    __tablename__ = "alert_records"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("stations.id", ondelete="CASCADE"), nullable=False, index=True)
    city_name = Column(String(100), nullable=False)
    station_name = Column(String(150), nullable=False)
    
    severity = Column(String(20), nullable=False) # Info, Warning, Danger, Critical
    alert_type = Column(String(50), nullable=False) # ObservedThreshold, ForecastWarning, AirQualitySpike
    pollutant = Column(String(20), nullable=False)
    measured_value = Column(Float, nullable=False)
    threshold_value = Column(Float, nullable=False)
    
    message = Column(Text, nullable=False)
    triggered_at = Column(DateTime, default=datetime.utcnow, index=True)
    is_acknowledged = Column(Boolean, default=False)
    acknowledged_at = Column(DateTime, nullable=True)

    station = relationship("Station", back_populates="alerts")
