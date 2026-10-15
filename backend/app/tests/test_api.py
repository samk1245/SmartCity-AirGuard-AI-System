import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.aqi_calculator import calculate_cpcb_aqi, get_aqi_category, get_sub_index

client = TestClient(app)

def test_cpcb_aqi_calculation():
    # Good range: PM2.5 = 15 -> AQI 25
    si = get_sub_index(15.0, "pm25")
    assert 20 <= si <= 30
    assert get_aqi_category(si) == "Good"

    # Moderate range: PM2.5 = 75 -> AQI between 101 and 200
    si_mod = get_sub_index(75.0, "pm25")
    assert 101 <= si_mod <= 200
    assert get_aqi_category(si_mod) == "Moderate"

    # Composite check
    aqi, cat, dominant = calculate_cpcb_aqi({"pm25": 110.0, "pm10": 80.0, "no2": 30.0})
    assert cat in ["Poor", "Very Poor"]
    assert dominant == "pm25"

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database_connected"] is True
    assert data["active_stations_count"] > 0

def test_locations_endpoint():
    response = client.get("/api/locations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5 # Delhi, Lucknow, Prayagraj, Kanpur, Varanasi
    city_names = [c["name"] for c in data]
    assert "Prayagraj" in city_names
    assert "Delhi" in city_names
    assert "Lucknow" in city_names

def test_current_air_quality_endpoint():
    response = client.get("/api/air-quality/current")
    assert response.status_code == 200
    data = response.json()
    assert "overall_aqi" in data
    assert "overall_category" in data
    assert len(data["readings"]) > 0

def test_historical_summary_endpoint():
    response = client.get("/api/air-quality/summary?aggregation=daily")
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] > 0
    assert "trend_data" in data
    assert len(data["trend_data"]) > 0
    assert "correlations" in data

def test_forecast_endpoint():
    # Use first available station
    locs = client.get("/api/locations").json()
    station_id = locs[0]["stations"][0]["id"]
    
    response = client.post(f"/api/predictions/forecast?station_id={station_id}&horizon_hours=12")
    assert response.status_code == 200
    data = response.json()
    assert len(data["forecasts"]) == 12
    assert "current_aqi" in data
    first_pt = data["forecasts"][0]
    assert first_pt["predicted_aqi"] > 0
    assert "predicted_category" in first_pt
    assert first_pt["confidence_lower"] is not None

def test_alerts_endpoint():
    response = client.get("/api/alerts")
    assert response.status_code == 200
    data = response.json()
    assert "total_unread" in data
    assert "recent_alerts" in data
    if data["recent_alerts"]:
        alert_id = data["recent_alerts"][0]["id"]
        ack_res = client.patch(f"/api/alerts/{alert_id}/acknowledge")
        assert ack_res.status_code == 200
        assert ack_res.json()["is_acknowledged"] is True

def test_map_stations_endpoint():
    response = client.get("/api/map/stations")
    assert response.status_code == 200
    data = response.json()
    assert "stations" in data
    assert len(data["stations"]) > 0
    assert "city_centers" in data
