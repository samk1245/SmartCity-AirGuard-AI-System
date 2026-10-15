from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import AlertRecord, AirQualityObservation, Station, City

# Cooldown window to prevent duplicate alert notifications (in hours)
ALERT_COOLDOWN_HOURS = 4

def check_and_create_observation_alerts(
    db: Session, 
    obs: AirQualityObservation
) -> Optional[AlertRecord]:
    """
    Evaluates a new or current observation against health thresholds.
    Triggers an alert only if cooldown period has elapsed since previous alert for this station.
    """
    station = db.query(Station).filter(Station.id == obs.station_id).first()
    if not station:
        return None

    city_name = station.city.name if station.city else "Unknown City"

    # Determine severity
    severity = None
    message = None
    pollutant = obs.primary_pollutant or "AQI"

    if obs.aqi >= 401:
        severity = "Critical"
        message = (
            f"CRITICAL HEALTH HAZARD: Severe AQI ({obs.aqi:.0f}) recorded at {station.name}, {city_name}. "
            "May cause respiratory effects even in healthy people; serious risk for vulnerable populations."
        )
    elif obs.aqi >= 301:
        severity = "Danger"
        message = (
            f"HIGH POLLUTION WARNING: Very Poor AQI ({obs.aqi:.0f}) at {station.name}, {city_name}. "
            f"Elevated {pollutant.upper()} levels. Outdoor activities should be avoided."
        )
    elif obs.aqi >= 201:
        severity = "Warning"
        message = (
            f"POLLUTION ADVISORY: Poor AQI ({obs.aqi:.0f}) at {station.name}, {city_name}. "
            "People with existing asthma or lung disease should wear N95 masks."
        )

    if not severity:
        return None

    # Check cooldown against recent alerts for this station
    cutoff = datetime.utcnow() - timedelta(hours=ALERT_COOLDOWN_HOURS)
    recent_alert = db.query(AlertRecord)\
        .filter(AlertRecord.station_id == obs.station_id)\
        .filter(AlertRecord.severity == severity)\
        .filter(AlertRecord.triggered_at >= cutoff)\
        .first()

    if recent_alert:
        return None # Cooldown active

    alert = AlertRecord(
        station_id=station.id,
        city_name=city_name,
        station_name=station.name,
        severity=severity,
        alert_type="ObservedThreshold",
        pollutant=pollutant.upper(),
        measured_value=obs.aqi,
        threshold_value=200.0 if severity == "Warning" else (300.0 if severity == "Danger" else 400.0),
        message=message,
        triggered_at=obs.timestamp or datetime.utcnow(),
        is_acknowledged=False
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

def get_alerts_list(
    db: Session,
    station_id: Optional[int] = None,
    city_name: Optional[str] = None,
    severity: Optional[str] = None,
    is_acknowledged: Optional[bool] = None,
    limit: int = 50
) -> List[AlertRecord]:
    """Retrieves alerts matching filter criteria sorted with newest first."""
    query = db.query(AlertRecord)
    if station_id:
        query = query.filter(AlertRecord.station_id == station_id)
    if city_name:
        query = query.filter(AlertRecord.city_name.ilike(f"%{city_name}%"))
    if severity:
        query = query.filter(AlertRecord.severity == severity)
    if is_acknowledged is not None:
        query = query.filter(AlertRecord.is_acknowledged == is_acknowledged)

    return query.order_by(AlertRecord.triggered_at.desc()).limit(limit).all()

def acknowledge_alert(db: Session, alert_id: int) -> Optional[AlertRecord]:
    """Marks an alert record as acknowledged."""
    alert = db.query(AlertRecord).filter(AlertRecord.id == alert_id).first()
    if not alert:
        return None

    alert.is_acknowledged = True
    alert.acknowledged_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return alert
