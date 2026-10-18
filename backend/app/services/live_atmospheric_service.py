import time
import math
from typing import Dict, Any, List, Optional
import httpx
from app.services.aqi_calculator import calculate_cpcb_aqi, get_aqi_category

# Simple in-memory cache for external atmospheric API calls (5 minutes TTL)
_ATMOSPHERIC_CACHE: Dict[str, Dict[str, Any]] = {}
CACHE_TTL_SECONDS = 300

# Pre-defined global reference megacities for the 3D Interactive Earth
GLOBAL_MEGACITIES = [
    {"name": "Delhi", "country": "India", "lat": 28.6139, "lng": 77.2090, "base_aqi": 275},
    {"name": "Mumbai", "country": "India", "lat": 19.0760, "lng": 72.8777, "base_aqi": 138},
    {"name": "Bengaluru", "country": "India", "lat": 12.9716, "lng": 77.5946, "base_aqi": 82},
    {"name": "Prayagraj", "country": "India", "lat": 25.4358, "lng": 81.8463, "base_aqi": 195},
    {"name": "Kolkata", "country": "India", "lat": 22.5726, "lng": 88.3639, "base_aqi": 182},
    {"name": "Lucknow", "country": "India", "lat": 26.8467, "lng": 80.9462, "base_aqi": 210},
    {"name": "Tokyo", "country": "Japan", "lat": 35.6762, "lng": 139.6503, "base_aqi": 42},
    {"name": "New York", "country": "United States", "lat": 40.7128, "lng": -74.0060, "base_aqi": 48},
    {"name": "London", "country": "United Kingdom", "lat": 51.5074, "lng": -0.1278, "base_aqi": 52},
    {"name": "Paris", "country": "France", "lat": 48.8566, "lng": 2.3522, "base_aqi": 56},
    {"name": "Beijing", "country": "China", "lat": 39.9042, "lng": 116.4074, "base_aqi": 165},
    {"name": "Dubai", "country": "UAE", "lat": 25.2048, "lng": 55.2708, "base_aqi": 145},
    {"name": "Singapore", "country": "Singapore", "lat": 1.3521, "lng": 103.8198, "base_aqi": 62},
    {"name": "Sydney", "country": "Australia", "lat": -33.8688, "lng": 151.2093, "base_aqi": 28},
    {"name": "São Paulo", "country": "Brazil", "lat": -23.5505, "lng": -46.6333, "base_aqi": 95},
    {"name": "Cairo", "country": "Egypt", "lat": 30.0444, "lng": 31.2357, "base_aqi": 178},
    {"name": "Seoul", "country": "South Korea", "lat": 37.5665, "lng": 126.9780, "base_aqi": 78},
    {"name": "Bangkok", "country": "Thailand", "lat": 13.7563, "lng": 100.5018, "base_aqi": 122},
    {"name": "Toronto", "country": "Canada", "lat": 43.6532, "lng": -79.3832, "base_aqi": 34},
    {"name": "Johannesburg", "country": "South Africa", "lat": -26.2041, "lng": 28.0473, "base_aqi": 88},
]

def lat_lng_to_3d_sphere(lat: float, lng: float, radius: float = 1.0) -> Dict[str, float]:
    """Converts Latitude/Longitude degrees to 3D Cartesian coordinates on a sphere."""
    phi = (90 - lat) * (math.pi / 180)
    theta = (lng + 180) * (math.pi / 180)
    x = -(radius * math.sin(phi) * math.cos(theta))
    z = radius * math.sin(phi) * math.sin(theta)
    y = radius * math.cos(phi)
    return {"x": round(x, 4), "y": round(y, 4), "z": round(z, 4)}

async def fetch_live_atmospheric_data(lat: float, lng: float, city_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Fetches real-time atmospheric pollution and weather observations from Open-Meteo
    for any coordinates worldwide with transparent CPCB standard translation.
    """
    cache_key = f"{round(lat, 2)}_{round(lng, 2)}"
    now = time.time()

    if cache_key in _ATMOSPHERIC_CACHE:
        cached = _ATMOSPHERIC_CACHE[cache_key]
        if now - cached["cached_at"] < CACHE_TTL_SECONDS:
            return cached["data"]

    air_url = (
        f"https://air-quality-api.open-meteo.com/v1/air-quality?"
        f"latitude={lat}&longitude={lng}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,"
        f"nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm2_5,pm10,european_aqi&forecast_days=3"
    )

    weather_url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,"
        f"precipitation,wind_speed_10m,wind_direction_10m,weather_code&hourly=temperature_2m,relative_humidity_2m&forecast_days=3"
    )

    aq_data = {}
    weather_data = {}

    async with httpx.AsyncClient(timeout=8.0) as client:
        try:
            r_aq = await client.get(air_url)
            if r_aq.status_code == 200:
                aq_data = r_aq.json()
        except Exception as e:
            print(f"[Live Atmospheric] Warning fetching air quality: {e}")

        try:
            r_w = await client.get(weather_url)
            if r_w.status_code == 200:
                weather_data = r_w.json()
        except Exception as e:
            print(f"[Live Atmospheric] Warning fetching weather: {e}")

    # Process pollutant readings
    curr_aq = aq_data.get("current", {})
    curr_w = weather_data.get("current", {})

    pm25 = curr_aq.get("pm2_5")
    pm10 = curr_aq.get("pm10")
    no2 = curr_aq.get("nitrogen_dioxide")
    so2 = curr_aq.get("sulphur_dioxide")
    co_raw = curr_aq.get("carbon_monoxide")
    co = round(co_raw / 1000.0, 2) if co_raw is not None else None # µg/m³ to mg/m³
    o3 = curr_aq.get("ozone")

    # Compute CPCB standard AQI
    pollutants_map = {
        "pm25": pm25,
        "pm10": pm10,
        "no2": no2,
        "so2": so2,
        "co": co,
        "o3": o3
    }
    cpcb_aqi, cpcb_cat, dominant = calculate_cpcb_aqi(pollutants_map)

    # Fallback to European/US AQI if sub-indices are missing
    if cpcb_aqi == 0 and curr_aq.get("us_aqi"):
        cpcb_aqi = float(curr_aq["us_aqi"])
        cpcb_cat = get_aqi_category(cpcb_aqi)

    # Hourly forecast curve (24 hours)
    hourly_series = []
    hourly_times = aq_data.get("hourly", {}).get("time", [])
    hourly_pm25 = aq_data.get("hourly", {}).get("pm2_5", [])
    hourly_pm10 = aq_data.get("hourly", {}).get("pm10", [])

    for i in range(min(24, len(hourly_times))):
        p25 = hourly_pm25[i] if i < len(hourly_pm25) else 35.0
        p10 = hourly_pm10[i] if i < len(hourly_pm10) else 65.0
        h_aqi, h_cat, _ = calculate_cpcb_aqi({"pm25": p25, "pm10": p10})
        hourly_series.append({
            "time": hourly_times[i],
            "predicted_aqi": h_aqi,
            "category": h_cat,
            "pm25": p25,
            "pm10": p10
        })

    result = {
        "location": {
            "city": city_name or "Detected Location",
            "latitude": round(lat, 4),
            "longitude": round(lng, 4),
        },
        "air_quality": {
            "aqi": round(cpcb_aqi, 1),
            "category": cpcb_cat,
            "dominant_pollutant": dominant.upper(),
            "pm25": round(pm25, 1) if pm25 is not None else None,
            "pm10": round(pm10, 1) if pm10 is not None else None,
            "no2": round(no2, 1) if no2 is not None else None,
            "so2": round(so2, 1) if so2 is not None else None,
            "co": co,
            "o3": round(o3, 1) if o3 is not None else None,
            "european_aqi": curr_aq.get("european_aqi"),
            "us_aqi": curr_aq.get("us_aqi"),
            "data_source": "Open-Meteo Global Atmospheric Reanalysis & CPCB Standards",
            "last_updated": curr_aq.get("time") or time.strftime("%Y-%m-%dT%H:%M"),
        },
        "weather": {
            "temperature": curr_w.get("temperature_2m", 26.5),
            "apparent_temperature": curr_w.get("apparent_temperature", 28.0),
            "humidity": curr_w.get("relative_humidity_2m", 55),
            "wind_speed": curr_w.get("wind_speed_10m", 6.5),
            "wind_direction": curr_w.get("wind_direction_10m", 180),
            "precipitation": curr_w.get("precipitation", 0.0),
            "weather_code": curr_w.get("weather_code", 0),
        },
        "forecast_24h": hourly_series,
        "is_modeled": True
    }

    _ATMOSPHERIC_CACHE[cache_key] = {"data": result, "cached_at": now}
    return result

async def search_geocoding_locations(query: str) -> List[Dict[str, Any]]:
    """Searches for cities and administrative regions worldwide matching a query string."""
    if not query or len(query.strip()) < 2:
        return []

    url = f"https://geocoding-api.open-meteo.com/v1/search?name={query.strip()}&count=8&language=en&format=json"
    async with httpx.AsyncClient(timeout=6.0) as client:
        try:
            res = await client.get(url)
            if res.status_code == 200:
                results = res.json().get("results", [])
                return [
                    {
                        "id": item.get("id"),
                        "name": item.get("name"),
                        "latitude": item.get("latitude"),
                        "longitude": item.get("longitude"),
                        "country": item.get("country", ""),
                        "admin1": item.get("admin1", ""), # State / Province
                        "timezone": item.get("timezone", "")
                    }
                    for item in results
                ]
        except Exception as e:
            print(f"[Geocoding Search] Error searching locations: {e}")
            return []

    return []

def get_global_earth_points() -> List[Dict[str, Any]]:
    """Returns global megacities with 3D spherical positions (x, y, z) and AQI indicators."""
    points = []
    for city in GLOBAL_MEGACITIES:
        pos_3d = lat_lng_to_3d_sphere(city["lat"], city["lng"], radius=1.0)
        aqi_val = city["base_aqi"]
        category = get_aqi_category(aqi_val)

        points.append({
            "name": city["name"],
            "country": city["country"],
            "latitude": city["lat"],
            "longitude": city["lng"],
            "position_3d": pos_3d,
            "aqi": aqi_val,
            "category": category
        })
    return points
