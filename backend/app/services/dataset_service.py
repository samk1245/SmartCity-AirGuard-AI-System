import io
from datetime import datetime
from typing import Dict, Any, List
import pandas as pd
from sqlalchemy.orm import Session
from app.models.models import City, Station, AirQualityObservation
from app.services.aqi_calculator import calculate_cpcb_aqi, get_aqi_category

REQUIRED_COLUMNS = ["timestamp", "station_code"]

def validate_and_import_csv(
    db: Session,
    file_bytes: bytes,
    filename: str
) -> Dict[str, Any]:
    """
    Validates uploaded CSV file against schema, timestamps, and physical value ranges.
    Safely deduplicates and inserts new air quality observations.
    """
    try:
        df = pd.read_csv(io.BytesIO(file_bytes))
    except Exception as e:
        return {
            "success": False,
            "filename": filename,
            "error": f"Failed to parse CSV file: {str(e)}",
            "imported_count": 0,
            "skipped_count": 0
        }

    # Normalize column headers
    df.columns = [col.strip().lower() for col in df.columns]

    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        return {
            "success": False,
            "filename": filename,
            "error": f"Missing required columns: {', '.join(missing_cols)}. File must contain 'timestamp' and 'station_code'.",
            "imported_count": 0,
            "skipped_count": 0
        }

    # Parse timestamps
    try:
        df["timestamp"] = pd.to_datetime(df["timestamp"])
    except Exception:
        return {
            "success": False,
            "filename": filename,
            "error": "Failed to parse 'timestamp' column as valid dates/times.",
            "imported_count": 0,
            "skipped_count": 0
        }

    # Build station cache
    stations = db.query(Station).all()
    station_map = {s.code.lower(): s for s in stations}
    
    # Check if station names or cities are provided to dynamically register new stations
    imported_count = 0
    skipped_count = 0
    errors_summary = []

    records_to_insert = []
    
    # Existing observation keys in DB for deduplication: (station_id, timestamp)
    existing_records = set(
        db.query(AirQualityObservation.station_id, AirQualityObservation.timestamp).all()
    )

    for idx, row in df.iterrows():
        st_code = str(row["station_code"]).strip().lower()
        station = station_map.get(st_code)

        if not station:
            # Attempt to auto-create station if city and station_name exist
            st_name = str(row.get("station_name", st_code.upper()))
            city_name = str(row.get("city", "Other City"))
            
            city = db.query(City).filter(City.name.ilike(city_name)).first()
            if not city:
                city = City(
                    name=city_name,
                    state=str(row.get("state", "India")),
                    country="India",
                    latitude=float(row.get("latitude", 25.0)),
                    longitude=float(row.get("longitude", 80.0))
                )
                db.add(city)
                db.flush()

            station = Station(
                city_id=city.id,
                name=st_name,
                code=str(row["station_code"]).strip().upper(),
                latitude=float(row.get("latitude", city.latitude)),
                longitude=float(row.get("longitude", city.longitude)),
                is_active=True
            )
            db.add(station)
            db.flush()
            station_map[st_code] = station

        ts = row["timestamp"].to_pydatetime()
        if (station.id, ts) in existing_records:
            skipped_count += 1
            continue

        # Extract & sanitize numerical values
        pm25 = float(row["pm25"]) if "pm25" in row and pd.notnull(row["pm25"]) and 0 <= float(row["pm25"]) <= 2000 else None
        pm10 = float(row["pm10"]) if "pm10" in row and pd.notnull(row["pm10"]) and 0 <= float(row["pm10"]) <= 3000 else None
        no2 = float(row["no2"]) if "no2" in row and pd.notnull(row["no2"]) and 0 <= float(row["no2"]) <= 1000 else None
        so2 = float(row["so2"]) if "so2" in row and pd.notnull(row["so2"]) and 0 <= float(row["so2"]) <= 2000 else None
        co = float(row["co"]) if "co" in row and pd.notnull(row["co"]) and 0 <= float(row["co"]) <= 100 else None
        o3 = float(row["o3"]) if "o3" in row and pd.notnull(row["o3"]) and 0 <= float(row["o3"]) <= 1000 else None

        # Determine AQI
        if "aqi" in row and pd.notnull(row["aqi"]) and float(row["aqi"]) >= 0:
            aqi_val = round(float(row["aqi"]), 1)
            cat = get_aqi_category(aqi_val)
            dominant = "pm25"
        else:
            aqi_val, cat, dominant = calculate_cpcb_aqi({
                "pm25": pm25, "pm10": pm10, "no2": no2, "so2": so2, "co": co, "o3": o3
            })

        temp = float(row["temperature"]) if "temperature" in row and pd.notnull(row["temperature"]) else None
        hum = float(row["humidity"]) if "humidity" in row and pd.notnull(row["humidity"]) else None
        wind = float(row["wind_speed"]) if "wind_speed" in row and pd.notnull(row["wind_speed"]) else None
        rain = float(row["rainfall"]) if "rainfall" in row and pd.notnull(row["rainfall"]) else 0.0

        obs = AirQualityObservation(
            station_id=station.id,
            timestamp=ts,
            pm25=pm25,
            pm10=pm10,
            no2=no2,
            so2=so2,
            co=co,
            o3=o3,
            aqi=aqi_val,
            aqi_category=cat,
            primary_pollutant=dominant,
            temperature=temp,
            humidity=hum,
            wind_speed=wind,
            rainfall=rain,
            data_source="user_upload"
        )
        records_to_insert.append(obs)
        existing_records.add((station.id, ts))
        imported_count += 1

    if records_to_insert:
        db.bulk_save_objects(records_to_insert)
        db.commit()

    return {
        "success": True,
        "filename": filename,
        "imported_count": imported_count,
        "skipped_count": skipped_count,
        "total_rows_processed": len(df),
        "validation_notes": f"Successfully ingested {imported_count} observations. Skipped {skipped_count} existing duplicate timestamps."
    }
