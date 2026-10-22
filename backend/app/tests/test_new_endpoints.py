"""Tests for India Location Explorer, Health Recommendations, Scoreboard, and Radial Radar."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.india_locations import get_all_states, search_cities_india, get_state_summary, get_cities_for_state
from app.services.health_recommendations import get_health_recommendations
from app.services.aqi_calculator import get_aqi_category, calculate_cpcb_aqi

client = TestClient(app)


# ── India Geographic Services ────────────────────────────────────────────────

def test_get_all_states_returns_36():
    states = get_all_states()
    assert len(states) == 36, f"Expected 36 states/UTs, got {len(states)}"
    assert "Delhi" in states
    assert "Uttar Pradesh" in states
    assert "Maharashtra" in states
    assert "Karnataka" in states
    assert "Ladakh" in states


def test_search_cities_india_results():
    results = search_cities_india("Delhi")
    assert len(results) > 0
    names = [r["name"] for r in results]
    assert any("Delhi" in n for n in names)


def test_search_cities_india_empty_query():
    results = search_cities_india("xyz_non_existent_city_999")
    assert results == []


def test_state_summary_structure():
    summary = get_state_summary()
    assert len(summary) == 36
    for item in summary:
        assert "state" in item
        assert "capital" in item
        assert "total_cities" in item
        assert "monitored_cities" in item
        assert "coverage_percentage" in item


def test_get_cities_for_state():
    up_cities = get_cities_for_state("Uttar Pradesh")
    assert len(up_cities) >= 10
    names = [c["name"] for c in up_cities]
    assert "Lucknow" in names
    assert "Kanpur" in names
    assert "Prayagraj" in names


# ── Health Recommendations ────────────────────────────────────────────────────

@pytest.mark.parametrize("aqi,category,expected_status", [
    (30, "Good", "safe"),
    (80, "Satisfactory", "safe"),
    (150, "Moderate", "caution"),
    (250, "Poor", "avoid_prolonged"),
    (350, "Very Poor", "avoid"),
    (450, "Severe", "strictly_avoid"),
])
def test_health_recommendations_by_aqi(aqi, category, expected_status):
    result = get_health_recommendations(aqi=aqi, category=category, dominant_pollutant="pm25")
    assert result["outdoor_activity_status"] == expected_status
    assert result["aqi"] == aqi
    assert "activity_recommendations" in result
    assert "vulnerable_groups" in result
    assert len(result["vulnerable_groups"]) >= 5


def test_health_recommendations_mask_status():
    good_res = get_health_recommendations(aqi=30, category="Good", dominant_pollutant="pm25")
    assert good_res["mask_required"] is False

    poor_res = get_health_recommendations(aqi=260, category="Poor", dominant_pollutant="pm25")
    assert poor_res["mask_required"] is True


def test_health_recommendations_disclaimer():
    res = get_health_recommendations(aqi=180, category="Moderate", dominant_pollutant="pm10")
    assert "disclaimer" in res
    assert "medical" in res["disclaimer"].lower() or "clinical" in res["disclaimer"].lower()


# ── AQI Classification Regression ─────────────────────────────────────────────

def test_cpcb_aqi_categories():
    assert get_aqi_category(10) == "Good"
    assert get_aqi_category(75) == "Satisfactory"
    assert get_aqi_category(160) == "Moderate"
    assert get_aqi_category(240) == "Poor"
    assert get_aqi_category(360) == "Very Poor"
    assert get_aqi_category(480) == "Severe"


# ── API Endpoint Integration Tests ───────────────────────────────────────────

def test_states_endpoint():
    response = client.get("/api/locations/states")
    assert response.status_code == 200
    data = response.json()
    assert "states" in data
    assert len(data["states"]) == 36


def test_all_states_list_endpoint():
    response = client.get("/api/locations/india/all-states")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 36


def test_cities_by_state_endpoint():
    response = client.get("/api/locations/states/Maharashtra/cities")
    assert response.status_code == 200
    data = response.json()
    assert data["state"] == "Maharashtra"
    assert len(data["cities"]) > 0


def test_cities_by_state_not_found():
    response = client.get("/api/locations/states/NonExistentStateXYZ/cities")
    assert response.status_code == 404


def test_india_city_search_endpoint():
    response = client.get("/api/locations/india/search?q=Bengaluru")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    assert any("Bengaluru" in r["name"] for r in data["results"])


def test_health_recommendations_endpoint():
    response = client.get("/api/health-recommendations?aqi=220&category=Poor&dominant_pollutant=pm25")
    assert response.status_code == 200
    data = response.json()
    assert data["outdoor_activity_status"] == "avoid_prolonged"
    assert data["mask_required"] is True


def test_scoreboard_endpoint():
    response = client.get("/api/scoreboard?sort_by=worst")
    assert response.status_code == 200
    data = response.json()
    assert "scoreboard" in data


def test_nearby_stations_endpoint():
    # Delhi coordinates
    response = client.get("/api/air-quality/nearby?latitude=28.6139&longitude=77.2090&radius_km=100")
    assert response.status_code == 200
    data = response.json()
    assert "stations" in data
    assert "total_found" in data


def test_compare_cities_endpoint():
    response = client.get("/api/air-quality/compare?cities=Delhi,Lucknow")
    assert response.status_code == 200
    data = response.json()
    assert "comparison" in data
    assert len(data["comparison"]) == 2
