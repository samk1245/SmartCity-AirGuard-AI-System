"""
Atmospheric Planetary Boundary Layer (PBL) & Thermal Inversion Analysis Service.
Calculates mixing layer height, ventilation coefficients, and smog trapping risk
based on IMD / CPCB micro-meteorological dispersion guidelines.
"""
import math
from datetime import datetime
from typing import Dict, Any, Optional

def calculate_boundary_layer_dynamics(
    temperature: float,
    humidity: float,
    wind_speed_kmh: float,
    hour_of_day: Optional[int] = None,
    month: Optional[int] = None
) -> Dict[str, Any]:
    """
    Computes Planetary Boundary Layer Height (PBLH), Ventilation Coefficient (Vi),
    Pasquill-Gifford stability class, and nocturnal smog inversion probability.
    """
    if hour_of_day is None:
        hour_of_day = datetime.utcnow().hour
    if month is None:
        month = datetime.utcnow().month

    # Convert wind speed to m/s
    wind_speed_ms = max(0.5, wind_speed_kmh / 3.6)

    # 1. Base Boundary Layer Height (m) based on solar radiation diurnal cycle
    # Daytime thermal convection: peak between 13:00 - 15:00 (1200m - 2000m)
    # Nighttime nocturnal cooling inversion: 01:00 - 06:00 (150m - 400m)
    if 6 <= hour_of_day <= 18:
        # Solar convective cycle
        solar_phase = math.sin((hour_of_day - 6) * math.pi / 12)
        pblh = 450.0 + (1100.0 * solar_phase) + (wind_speed_ms * 35.0)
    else:
        # Nocturnal boundary layer compression
        night_hour = (hour_of_day - 18) if hour_of_day >= 18 else (hour_of_day + 6)
        cooling_intensity = math.cos(night_hour * math.pi / 12)
        pblh = 220.0 + (150.0 * cooling_intensity) + (wind_speed_ms * 20.0)

    # Winter temperature inversion compression factor (Nov - Feb)
    winter_factor = 0.72 if month in [11, 12, 1, 2] else 1.0
    pblh = round(max(120.0, pblh * winter_factor), 1)

    # 2. Ventilation Coefficient Vi = PBLH (m) * Wind Speed (m/s)
    # Unit: m²/s. CPCB benchmark: < 2000 is poor dispersion; > 6000 is good
    ventilation_coefficient = round(pblh * wind_speed_ms, 1)

    # 3. Ventilation Category
    if ventilation_coefficient < 2000:
        vent_status = "Critical Stagnation"
        vent_color = "#ef4444"
        dispersion_class = "Poor"
    elif ventilation_coefficient < 6000:
        vent_status = "Moderate Dilution"
        vent_color = "#f59e0b"
        dispersion_class = "Fair"
    else:
        vent_status = "Optimal Cleansing"
        vent_color = "#10b981"
        dispersion_class = "Excellent"

    # 4. Pasquill-Gifford Stability Class
    # A (Extremely Unstable), B (Moderately Unstable), C (Slightly Unstable),
    # D (Neutral), E (Slightly Stable), F (Moderately Stable)
    is_day = 6 <= hour_of_day <= 18
    if is_day:
        if wind_speed_ms < 2:
            stability_class = "A - Extremely Unstable"
        elif wind_speed_ms < 3.5:
            stability_class = "B - Moderately Unstable"
        elif wind_speed_ms < 5:
            stability_class = "C - Slightly Unstable"
        else:
            stability_class = "D - Neutral"
    else:
        if wind_speed_ms < 2:
            stability_class = "F - Moderately Stable (High Inversion)"
        elif wind_speed_ms < 3:
            stability_class = "E - Slightly Stable"
        else:
            stability_class = "D - Neutral"

    # 5. Inversion Risk Assessment
    inversion_risk = "High" if (not is_day and wind_speed_ms < 2.5 and humidity > 60) else (
        "Moderate" if (not is_day or pblh < 500) else "Low"
    )

    advisory = (
        "Thermal inversion lid active: ground emissions are trapped within the shallow boundary layer. Avoid morning outdoor jogging."
        if inversion_risk == "High"
        else "Atmospheric vertical mixing is active; surface emissions are diluting into upper troposphere."
    )

    return {
        "timestamp": datetime.utcnow().isoformat(),
        "mixing_height_m": pblh,
        "wind_speed_ms": round(wind_speed_ms, 2),
        "ventilation_coefficient_m2s": ventilation_coefficient,
        "ventilation_status": vent_status,
        "dispersion_class": dispersion_class,
        "pasquill_stability": stability_class,
        "inversion_risk": inversion_risk,
        "meteorological_advisory": advisory,
        "safe_ventilation_threshold_m2s": 6000,
        "standards_reference": "IMD-CPCB Meteorological Dispersion & Air Quality Cleansing Matrix"
    }
