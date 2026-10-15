from typing import Dict, Tuple, Optional

# CPCB Sub-Index Breakpoint Tables
# Format: (C_low, C_high, I_low, I_high)
BREAKPOINTS = {
    "pm25": [
        (0.0, 30.0, 0, 50),
        (30.1, 60.0, 51, 100),
        (60.1, 90.0, 101, 200),
        (90.1, 120.0, 201, 300),
        (120.1, 250.0, 301, 400),
        (250.1, 500.0, 401, 500),
    ],
    "pm10": [
        (0.0, 50.0, 0, 50),
        (50.1, 100.0, 51, 100),
        (100.1, 250.0, 101, 200),
        (250.1, 350.0, 201, 300),
        (350.1, 430.0, 301, 400),
        (430.1, 600.0, 401, 500),
    ],
    "no2": [
        (0.0, 40.0, 0, 50),
        (40.1, 80.0, 51, 100),
        (80.1, 180.0, 101, 200),
        (180.1, 280.0, 201, 300),
        (280.1, 400.0, 301, 400),
        (400.1, 600.0, 401, 500),
    ],
    "so2": [
        (0.0, 40.0, 0, 50),
        (40.1, 80.0, 51, 100),
        (80.1, 380.0, 101, 200),
        (380.1, 800.0, 201, 300),
        (800.1, 1600.0, 301, 400),
        (1600.1, 2000.0, 401, 500),
    ],
    "co": [
        (0.0, 1.0, 0, 50),
        (1.01, 2.0, 51, 100),
        (2.01, 10.0, 101, 200),
        (10.01, 17.0, 201, 300),
        (17.01, 34.0, 301, 400),
        (34.01, 50.0, 401, 500),
    ],
    "o3": [
        (0.0, 50.0, 0, 50),
        (50.1, 100.0, 51, 100),
        (100.1, 168.0, 101, 200),
        (168.1, 208.0, 201, 300),
        (208.1, 748.0, 301, 400),
        (748.1, 1000.0, 401, 500),
    ],
}

def get_sub_index(concentration: float, pollutant: str) -> Optional[float]:
    """Calculate sub-index for a specific pollutant concentration using CPCB linear interpolation formula."""
    if concentration is None or concentration < 0:
        return None

    pollutant = pollutant.lower()
    if pollutant not in BREAKPOINTS:
        return None

    ranges = BREAKPOINTS[pollutant]
    for c_low, c_high, i_low, i_high in ranges:
        if c_low <= concentration <= c_high:
            sub_index = ((i_high - i_low) / (c_high - c_low)) * (concentration - c_low) + i_low
            return round(sub_index, 1)

    # Beyond top breakpoint
    if concentration > ranges[-1][1]:
        return 500.0

    return 0.0

def get_aqi_category(aqi_value: float) -> str:
    """Classify AQI according to Indian CPCB standard categories."""
    if aqi_value <= 50:
        return "Good"
    elif aqi_value <= 100:
        return "Satisfactory"
    elif aqi_value <= 200:
        return "Moderate"
    elif aqi_value <= 300:
        return "Poor"
    elif aqi_value <= 400:
        return "Very Poor"
    else:
        return "Severe"

def get_category_color(category: str) -> str:
    """Return theme color code for the given AQI category."""
    colors = {
        "Good": "#10b981",         # Emerald Green
        "Satisfactory": "#84cc16", # Light Green / Lime
        "Moderate": "#f59e0b",     # Amber Yellow
        "Poor": "#f97316",         # Orange
        "Very Poor": "#ef4444",    # Crimson Red
        "Severe": "#7f1d1d",       # Dark Maroon
    }
    return colors.get(category, "#64748b")

def calculate_cpcb_aqi(readings: Dict[str, Optional[float]]) -> Tuple[float, str, str]:
    """
    Calculate composite CPCB AQI from multiple pollutant concentrations.
    Returns: (aqi_value, category_string, dominant_pollutant)
    """
    sub_indices: Dict[str, float] = {}
    for pollutant, value in readings.items():
        if value is not None and pollutant in BREAKPOINTS:
            si = get_sub_index(value, pollutant)
            if si is not None:
                sub_indices[pollutant] = si

    if not sub_indices:
        return 0.0, "Good", "none"

    # CPCB rule: Overall AQI is the maximum of the sub-indices
    dominant_pollutant = max(sub_indices, key=sub_indices.get)
    max_aqi = round(sub_indices[dominant_pollutant], 1)
    category = get_aqi_category(max_aqi)

    return max_aqi, category, dominant_pollutant
