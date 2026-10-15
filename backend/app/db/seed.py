import os
import random
import math
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine
from app.models.models import City, Station, AirQualityObservation, AlertRecord
from app.services.aqi_calculator import calculate_cpcb_aqi, get_aqi_category
from app.core.config import settings

# Predefined Indian Urban Centers and Real Monitoring Stations
INDIAN_CITIES = [
    {
        "name": "Delhi",
        "state": "Delhi",
        "country": "India",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "stations": [
            {"name": "Anand Vihar, Delhi", "code": "DEL-AV-01", "lat": 28.6476, "lng": 77.3158, "elevation": 215.0, "base_pm25": 115},
            {"name": "RK Puram, Delhi", "code": "DEL-RKP-02", "lat": 28.5647, "lng": 77.1743, "elevation": 220.0, "base_pm25": 85},
            {"name": "Punjabi Bagh, Delhi", "code": "DEL-PB-03", "lat": 28.6725, "lng": 77.1306, "elevation": 218.0, "base_pm25": 95},
            {"name": "ITO, Central Delhi", "code": "DEL-ITO-04", "lat": 28.6312, "lng": 77.2410, "elevation": 216.0, "base_pm25": 105},
        ]
    },
    {
        "name": "Lucknow",
        "state": "Uttar Pradesh",
        "country": "India",
        "latitude": 26.8467,
        "longitude": 80.9462,
        "stations": [
            {"name": "Hazratganj, Lucknow", "code": "LKO-HG-01", "lat": 26.8467, "lng": 80.9462, "elevation": 123.0, "base_pm25": 80},
            {"name": "Talkatora Industrial, Lucknow", "code": "LKO-TI-02", "lat": 26.8306, "lng": 80.8986, "elevation": 120.0, "base_pm25": 110},
            {"name": "Gomti Nagar, Lucknow", "code": "LKO-GN-03", "lat": 26.8530, "lng": 80.9984, "elevation": 125.0, "base_pm25": 70},
        ]
    },
    {
        "name": "Prayagraj",
        "state": "Uttar Pradesh",
        "country": "India",
        "latitude": 25.4358,
        "longitude": 81.8463,
        "stations": [
            {"name": "Civil Lines, Prayagraj", "code": "PRY-CL-01", "lat": 25.4529, "lng": 81.8349, "elevation": 98.0, "base_pm25": 78},
            {"name": "Jhunsi, Prayagraj", "code": "PRY-JH-02", "lat": 25.4338, "lng": 81.9056, "elevation": 95.0, "base_pm25": 65},
            {"name": "Phaphamau, Prayagraj", "code": "PRY-PH-03", "lat": 25.5204, "lng": 81.8596, "elevation": 96.0, "base_pm25": 60},
        ]
    },
    {
        "name": "Kanpur",
        "state": "Uttar Pradesh",
        "country": "India",
        "latitude": 26.4499,
        "longitude": 80.3319,
        "stations": [
            {"name": "Nehru Nagar, Kanpur", "code": "KNP-NN-01", "lat": 26.4716, "lng": 80.3236, "elevation": 126.0, "base_pm25": 92},
            {"name": "Kalyanpur, Kanpur", "code": "KNP-KP-02", "lat": 26.4947, "lng": 80.2580, "elevation": 128.0, "base_pm25": 75},
        ]
    },
    {
        "name": "Varanasi",
        "state": "Uttar Pradesh",
        "country": "India",
        "latitude": 25.3176,
        "longitude": 82.9739,
        "stations": [
            {"name": "Bhelupur, Varanasi", "code": "VNS-BP-01", "lat": 25.2952, "lng": 82.9912, "elevation": 82.0, "base_pm25": 76},
            {"name": "BHU Campus, Varanasi", "code": "VNS-BHU-02", "lat": 25.2677, "lng": 82.9913, "elevation": 85.0, "base_pm25": 58},
            {"name": "Ardali Bazar, Varanasi", "code": "VNS-AB-03", "lat": 25.3374, "lng": 82.9806, "elevation": 80.0, "base_pm25": 84},
        ]
    }
]

def generate_synthetic_data(days_back: int = 90) -> pd.DataFrame:
    """
    Generates realistic hourly air quality and meteorological observations
    capturing diurnal cycles (morning/evening peaks), weather variations,
    and city-specific baseline levels.
    """
    random.seed(42)
    np.random.seed(42)

    end_date = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    start_date = end_date - timedelta(days=days_back)
    
    date_range = pd.date_range(start=start_date, end=end_date, freq="1h")
    records = []

    for city in INDIAN_CITIES:
        for st in city["stations"]:
            base = st["base_pm25"]

            for dt in date_range:
                hour = dt.hour
                day_of_week = dt.weekday()
                month = dt.month

                # Diurnal traffic/inversion factor:
                # Morning rush hour (7-10 AM) + Evening rush & winter inversion (18-23 PM)
                if 7 <= hour <= 10:
                    diurnal_factor = 1.35 + 0.15 * math.sin((hour - 7) * math.pi / 3)
                elif 18 <= hour <= 23:
                    diurnal_factor = 1.45 + 0.20 * math.sin((hour - 18) * math.pi / 5)
                elif 12 <= hour <= 16:
                    diurnal_factor = 0.75 # Good afternoon boundary layer dispersion
                else:
                    diurnal_factor = 0.95

                # Weekend traffic reduction
                weekend_factor = 0.88 if day_of_week >= 5 else 1.0

                # Seasonal factor (higher in winter Nov-Feb, moderate in autumn/spring, lowest in rainy July-Sept)
                if month in [11, 12, 1]:
                    seasonal_factor = 1.6
                elif month in [10, 2]:
                    seasonal_factor = 1.25
                elif month in [7, 8, 9]:
                    seasonal_factor = 0.55
                else:
                    seasonal_factor = 0.9

                # Temperature (°C)
                base_temp = 28.0 - 6.0 * math.cos((month - 1) * math.pi / 6)
                temp = base_temp + 5.0 * math.sin((hour - 8) * math.pi / 12) + np.random.normal(0, 1.2)
                temp = round(max(5.0, min(48.0, temp)), 1)

                # Humidity (%)
                base_humidity = 60.0 + (15.0 if month in [7, 8, 9] else -15.0 if month in [4, 5] else 0.0)
                humidity = base_humidity - 10.0 * math.sin((hour - 8) * math.pi / 12) + np.random.normal(0, 3.0)
                humidity = round(max(15.0, min(95.0, humidity)), 1)

                # Wind speed (km/h)
                wind_speed = 7.0 + 3.0 * math.sin(hour * math.pi / 12) + np.random.normal(0, 1.5)
                wind_speed = round(max(0.5, wind_speed), 1)

                # Rainfall (mm) - mostly monsoon or occasional shower
                rain_prob = 0.25 if month in [7, 8] else 0.03
                rainfall = round(np.random.exponential(4.0), 1) if np.random.random() < rain_prob else 0.0

                # Meteorological dispersion impact: high wind or rain cleans PM
                weather_clean_factor = 1.0
                if rainfall > 2.0:
                    weather_clean_factor *= 0.5
                if wind_speed > 12.0:
                    weather_clean_factor *= 0.75

                # Pollutants calculation
                pm25 = (base * diurnal_factor * weekend_factor * seasonal_factor * weather_clean_factor) + np.random.normal(0, base * 0.12)
                pm25 = round(max(5.0, pm25), 1)

                # PM10 is correlated with PM2.5 + road dust
                pm10 = pm25 * np.random.uniform(1.6, 2.1) + np.random.normal(0, 8.0)
                pm10 = round(max(pm25 + 5.0, pm10), 1)

                # NO2 (traffic exhaust)
                no2 = 25.0 * diurnal_factor * weekend_factor + np.random.normal(0, 4.0)
                no2 = round(max(4.0, no2), 1)

                # SO2 (industrial)
                so2 = 12.0 + (15.0 if "Industrial" in st["name"] else 0.0) + np.random.normal(0, 2.5)
                so2 = round(max(2.0, so2), 1)

                # CO (mg/m³)
                co = (0.7 + 0.6 * (diurnal_factor - 0.7)) + np.random.normal(0, 0.1)
                co = round(max(0.1, co), 2)

                # O3 (photochemical - peaks in midday sunlight)
                o3_factor = max(0.1, math.sin((hour - 6) * math.pi / 12)) if 6 <= hour <= 18 else 0.15
                o3 = 20.0 + 45.0 * o3_factor + np.random.normal(0, 3.0)
                o3 = round(max(5.0, o3), 1)

                # Compute CPCB standard AQI
                readings_dict = {"pm25": pm25, "pm10": pm10, "no2": no2, "so2": so2, "co": co, "o3": o3}
                aqi, category, dominant = calculate_cpcb_aqi(readings_dict)

                records.append({
                    "timestamp": dt,
                    "city": city["name"],
                    "state": city["state"],
                    "station_name": st["name"],
                    "station_code": st["code"],
                    "latitude": st["lat"],
                    "longitude": st["lng"],
                    "elevation": st["elevation"],
                    "pm25": pm25,
                    "pm10": pm10,
                    "no2": no2,
                    "so2": so2,
                    "co": co,
                    "o3": o3,
                    "aqi": aqi,
                    "aqi_category": category,
                    "primary_pollutant": dominant,
                    "temperature": temp,
                    "humidity": humidity,
                    "wind_speed": wind_speed,
                    "rainfall": rainfall,
                    "data_source": "sample_dataset"
                })

    df = pd.DataFrame(records)
    return df

def seed_database(days_back: int = 90):
    """
    Initializes tables, populates cities and stations, and loads realistic
    historical observations into the SQLite database.
    Also exports sample CSV to datasets/ folder.
    """
    print("[Seed] Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # Check if already seeded
        station_count = db.query(Station).count()
        obs_count = db.query(AirQualityObservation).count()
        if station_count > 0 and obs_count > 1000:
            print(f"[Seed] Database already contains {station_count} stations and {obs_count} observations. Skipping seed.")
            return

        print(f"[Seed] Generating {days_back} days of realistic urban pollution data...")
        df = generate_synthetic_data(days_back=days_back)

        # Export sample CSV for testing & user download/verification
        csv_path = os.path.join(settings.DATASETS_DIR, "indian_cities_air_quality_sample.csv")
        df.to_csv(csv_path, index=False)
        print(f"[Seed] Sample CSV exported to: {csv_path}")

        # Insert Cities & Stations
        station_id_map = {}
        for city_data in INDIAN_CITIES:
            city_obj = db.query(City).filter(City.name == city_data["name"]).first()
            if not city_obj:
                city_obj = City(
                    name=city_data["name"],
                    state=city_data["state"],
                    country=city_data["country"],
                    latitude=city_data["latitude"],
                    longitude=city_data["longitude"]
                )
                db.add(city_obj)
                db.flush()

            for st_data in city_data["stations"]:
                st_obj = db.query(Station).filter(Station.code == st_data["code"]).first()
                if not st_obj:
                    st_obj = Station(
                        city_id=city_obj.id,
                        name=st_data["name"],
                        code=st_data["code"],
                        latitude=st_data["lat"],
                        longitude=st_data["lng"],
                        elevation=st_data["elevation"],
                        is_active=True
                    )
                    db.add(st_obj)
                    db.flush()
                station_id_map[st_data["code"]] = st_obj.id

        db.commit()

        # Batch insert observations
        print(f"[Seed] Inserting {len(df)} observations into database...")
        batch_size = 2000
        records_to_insert = []

        for _, row in df.iterrows():
            st_id = station_id_map.get(row["station_code"])
            if not st_id:
                continue

            obs = AirQualityObservation(
                station_id=st_id,
                timestamp=pd.to_datetime(row["timestamp"]).to_pydatetime(),
                pm25=float(row["pm25"]),
                pm10=float(row["pm10"]),
                no2=float(row["no2"]),
                so2=float(row["so2"]),
                co=float(row["co"]),
                o3=float(row["o3"]),
                aqi=float(row["aqi"]),
                aqi_category=str(row["aqi_category"]),
                primary_pollutant=str(row["primary_pollutant"]),
                temperature=float(row["temperature"]),
                humidity=float(row["humidity"]),
                wind_speed=float(row["wind_speed"]),
                rainfall=float(row["rainfall"]),
                data_source="sample_dataset"
            )
            records_to_insert.append(obs)

            if len(records_to_insert) >= batch_size:
                db.bulk_save_objects(records_to_insert)
                db.commit()
                records_to_insert = []

        if records_to_insert:
            db.bulk_save_objects(records_to_insert)
            db.commit()

        # Seed initial smart alert records for high pollution hotspots
        latest_severe = db.query(AirQualityObservation).filter(AirQualityObservation.aqi >= 301).order_by(AirQualityObservation.timestamp.desc()).limit(5).all()
        for obs in latest_severe:
            st = db.query(Station).filter(Station.id == obs.station_id).first()
            alert = AlertRecord(
                station_id=obs.station_id,
                city_name=st.city.name if st.city else "Unknown",
                station_name=st.name,
                severity="Critical" if obs.aqi >= 401 else "Danger",
                alert_type="ObservedThreshold",
                pollutant=obs.primary_pollutant.upper(),
                measured_value=obs.aqi,
                threshold_value=300.0,
                message=f"Severe air pollution detected at {st.name} with AQI reaching {obs.aqi:.0f} (Category: {obs.aqi_category}). Sensitive groups should avoid outdoor exertion.",
                triggered_at=obs.timestamp,
                is_acknowledged=False
            )
            db.add(alert)
        db.commit()

        total_obs = db.query(AirQualityObservation).count()
        print(f"[Seed] Successfully seeded {len(station_id_map)} stations and {total_obs} observations!")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
