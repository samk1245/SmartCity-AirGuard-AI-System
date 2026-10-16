import os
import sys
import random
import math
from datetime import datetime, timedelta, timezone
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine
from app.models.models import City, Station, AirQualityObservation, AlertRecord
from app.services.aqi_calculator import calculate_cpcb_aqi, get_aqi_category
from app.core.config import settings

# 15 Major Indian Urban Centers and Real Monitoring Stations
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
    },
    {
        "name": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "stations": [
            {"name": "Bandra Kurla Complex (BKC)", "code": "MUM-BKC-01", "lat": 19.0657, "lng": 72.8687, "elevation": 14.0, "base_pm25": 75},
            {"name": "Colaba Coastal Zone", "code": "MUM-COL-02", "lat": 18.9067, "lng": 72.8147, "elevation": 11.0, "base_pm25": 48},
            {"name": "Andheri East Metro Hub", "code": "MUM-AND-03", "lat": 19.1136, "lng": 72.8697, "elevation": 20.0, "base_pm25": 82},
            {"name": "Navi Mumbai Vashi", "code": "MUM-NAV-04", "lat": 19.0330, "lng": 73.0297, "elevation": 15.0, "base_pm25": 68},
        ]
    },
    {
        "name": "Bengaluru",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "stations": [
            {"name": "BTM Layout, Bengaluru", "code": "BLR-BTM-01", "lat": 12.9165, "lng": 77.6101, "elevation": 910.0, "base_pm25": 44},
            {"name": "Silk Board Junction", "code": "BLR-SLK-02", "lat": 12.9172, "lng": 77.6229, "elevation": 912.0, "base_pm25": 68},
            {"name": "Whitefield IT Corridor", "code": "BLR-WHT-03", "lat": 12.9698, "lng": 77.7500, "elevation": 905.0, "base_pm25": 46},
            {"name": "Peenya Industrial Area", "code": "BLR-PNY-04", "lat": 13.0329, "lng": 77.5141, "elevation": 920.0, "base_pm25": 76},
        ]
    },
    {
        "name": "Kolkata",
        "state": "West Bengal",
        "country": "India",
        "latitude": 22.5726,
        "longitude": 88.3639,
        "stations": [
            {"name": "Victoria Memorial Green Zone", "code": "KOL-VIC-01", "lat": 22.5448, "lng": 88.3426, "elevation": 10.0, "base_pm25": 78},
            {"name": "Rabindra Bharati University", "code": "KOL-RBU-02", "lat": 22.5850, "lng": 88.3712, "elevation": 9.0, "base_pm25": 102},
            {"name": "Salt Lake Sector V Tech Hub", "code": "KOL-SLK-03", "lat": 22.5705, "lng": 88.4312, "elevation": 11.0, "base_pm25": 66},
        ]
    },
    {
        "name": "Hyderabad",
        "state": "Telangana",
        "country": "India",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "stations": [
            {"name": "Sanathnagar Industrial Hub", "code": "HYD-SNT-01", "lat": 17.4563, "lng": 78.4439, "elevation": 542.0, "base_pm25": 72},
            {"name": "HITEC City Cyber Towers", "code": "HYD-HTC-02", "lat": 17.4504, "lng": 78.3808, "elevation": 570.0, "base_pm25": 52},
            {"name": "Charminar Old City", "code": "HYD-CHM-03", "lat": 17.3616, "lng": 78.4747, "elevation": 510.0, "base_pm25": 76},
        ]
    },
    {
        "name": "Ahmedabad",
        "state": "Gujarat",
        "country": "India",
        "latitude": 23.0225,
        "longitude": 72.5714,
        "stations": [
            {"name": "Maninagar, Ahmedabad", "code": "AMD-MAN-01", "lat": 22.9978, "lng": 72.6033, "elevation": 53.0, "base_pm25": 84},
            {"name": "Chandkheda SG Highway", "code": "AMD-CHK-02", "lat": 23.1118, "lng": 72.5850, "elevation": 55.0, "base_pm25": 72},
            {"name": "Vatva GIDC Industrial Area", "code": "AMD-VAT-03", "lat": 22.9572, "lng": 72.6393, "elevation": 52.0, "base_pm25": 112},
        ]
    },
    {
        "name": "Jaipur",
        "state": "Rajasthan",
        "country": "India",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "stations": [
            {"name": "Mansarovar, Jaipur", "code": "JPR-MAN-01", "lat": 26.8530, "lng": 75.7674, "elevation": 431.0, "base_pm25": 80},
            {"name": "Shastri Nagar Central", "code": "JPR-SHS-02", "lat": 26.9452, "lng": 75.7973, "elevation": 435.0, "base_pm25": 88},
            {"name": "Sitapura Industrial Zone", "code": "JPR-STP-03", "lat": 26.7725, "lng": 75.8358, "elevation": 425.0, "base_pm25": 98},
        ]
    },
    {
        "name": "Patna",
        "state": "Bihar",
        "country": "India",
        "latitude": 25.5941,
        "longitude": 85.1376,
        "stations": [
            {"name": "Samanpura, Patna", "code": "PAT-SAM-01", "lat": 25.6186, "lng": 85.0934, "elevation": 53.0, "base_pm25": 115},
            {"name": "Danapur Transit Area", "code": "PAT-DAN-02", "lat": 25.6338, "lng": 85.0441, "elevation": 54.0, "base_pm25": 102},
            {"name": "Shikarpur Central Hub", "code": "PAT-SHK-03", "lat": 25.5941, "lng": 85.1376, "elevation": 52.0, "base_pm25": 108},
        ]
    },
    {
        "name": "Agra",
        "state": "Uttar Pradesh",
        "country": "India",
        "latitude": 27.1767,
        "longitude": 78.0081,
        "stations": [
            {"name": "Taj East Gate Heritage Zone", "code": "AGR-TEG-01", "lat": 27.1724, "lng": 78.0469, "elevation": 169.0, "base_pm25": 78},
            {"name": "Sanjay Place Commercial Hub", "code": "AGR-SJP-02", "lat": 27.2023, "lng": 78.0068, "elevation": 172.0, "base_pm25": 94},
        ]
    },
    {
        "name": "Pune",
        "state": "Maharashtra",
        "country": "India",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "stations": [
            {"name": "Shivajinagar, Pune", "code": "PUN-SHV-01", "lat": 18.5314, "lng": 73.8446, "elevation": 560.0, "base_pm25": 60},
            {"name": "Hinjawadi IT Park Zone 1", "code": "PUN-HNW-02", "lat": 18.5913, "lng": 73.7389, "elevation": 575.0, "base_pm25": 50},
        ]
    },
    {
        "name": "Chandigarh",
        "state": "Chandigarh",
        "country": "India",
        "latitude": 30.7333,
        "longitude": 76.7794,
        "stations": [
            {"name": "Sector 22 Commercial", "code": "CHD-S22-01", "lat": 30.7352, "lng": 76.7719, "elevation": 321.0, "base_pm25": 56},
            {"name": "Sector 53 Nature Park", "code": "CHD-S53-02", "lat": 30.7183, "lng": 76.7369, "elevation": 318.0, "base_pm25": 40},
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

    end_date = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0, tzinfo=None)
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

                # Seasonal factor
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

                # Rainfall (mm)
                rain_prob = 0.25 if month in [7, 8] else 0.03
                rainfall = round(np.random.exponential(4.0), 1) if np.random.random() < rain_prob else 0.0

                # Meteorological dispersion impact
                weather_clean_factor = 1.0
                if rainfall > 2.0:
                    weather_clean_factor *= 0.5
                if wind_speed > 12.0:
                    weather_clean_factor *= 0.75

                # Pollutants calculation
                pm25 = (base * diurnal_factor * weekend_factor * seasonal_factor * weather_clean_factor) + np.random.normal(0, base * 0.12)
                pm25 = round(max(5.0, pm25), 1)

                pm10 = pm25 * np.random.uniform(1.6, 2.1) + np.random.normal(0, 8.0)
                pm10 = round(max(pm25 + 5.0, pm10), 1)

                no2 = 25.0 * diurnal_factor * weekend_factor + np.random.normal(0, 4.0)
                no2 = round(max(4.0, no2), 1)

                so2 = 12.0 + (15.0 if "Industrial" in st["name"] else 0.0) + np.random.normal(0, 2.5)
                so2 = round(max(2.0, so2), 1)

                co = (0.7 + 0.6 * (diurnal_factor - 0.7)) + np.random.normal(0, 0.1)
                co = round(max(0.1, co), 2)

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

def seed_database(days_back: int = 90, force: bool = False):
    """
    Initializes tables, populates cities and stations, and loads realistic
    historical observations into the SQLite database.
    """
    print("[Seed] Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        station_count = db.query(Station).count()
        # If all 42 stations exist and not forced, skip
        if not force and station_count >= 35:
            print(f"[Seed] Database already contains {station_count} stations. Skipping seed.")
            return

        print(f"[Seed] Seeding database with 15 Indian metropolitan cities and 42 monitoring stations...")
        df = generate_synthetic_data(days_back=days_back)

        csv_path = os.path.join(settings.DATASETS_DIR, "indian_cities_air_quality_sample.csv")
        df.to_csv(csv_path, index=False)
        print(f"[Seed] Master CSV exported to: {csv_path}")

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

        # Batch insert observations for newly added stations
        print(f"[Seed] Ingesting {len(df)} multi-city observation records...")
        batch_size = 2500
        records_to_insert = []
        
        # Check existing station timestamps
        existing_keys = set(
            db.query(AirQualityObservation.station_id, AirQualityObservation.timestamp).all()
        )

        for _, row in df.iterrows():
            st_id = station_id_map.get(row["station_code"])
            if not st_id:
                continue

            ts = pd.to_datetime(row["timestamp"]).to_pydatetime()
            if (st_id, ts) in existing_keys:
                continue

            obs = AirQualityObservation(
                station_id=st_id,
                timestamp=ts,
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
            existing_keys.add((st_id, ts))

            if len(records_to_insert) >= batch_size:
                db.bulk_save_objects(records_to_insert)
                db.commit()
                records_to_insert = []

        if records_to_insert:
            db.bulk_save_objects(records_to_insert)
            db.commit()

        # Seed initial smart alert records
        latest_severe = db.query(AirQualityObservation).filter(AirQualityObservation.aqi >= 301).order_by(AirQualityObservation.timestamp.desc()).limit(8).all()
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
                message=f"Severe air pollution detected at {st.name} with AQI reaching {obs.aqi:.0f} ({obs.aqi_category}). Vulnerable citizens must stay indoors.",
                triggered_at=obs.timestamp,
                is_acknowledged=False
            )
            db.add(alert)
        db.commit()

        total_stations = db.query(Station).count()
        total_obs = db.query(AirQualityObservation).count()
        print(f"[Seed] Successfully seeded {total_stations} stations and {total_obs} total observations across India!")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    force_run = "--force" in sys.argv
    seed_database(days_back=90, force=force_run)
