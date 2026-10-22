"""
Comprehensive Environmental Health Guidance and Outdoor Activity Advisory Engine.
Compliant with CPCB National Air Quality Index (NAQI) guidelines and public health standards.
"""
from typing import Dict, Any, List, Optional

def get_health_recommendations(
    aqi: float,
    category: str,
    dominant_pollutant: str = "pm25",
    temperature: Optional[float] = None,
    humidity: Optional[float] = None,
    wind_speed: Optional[float] = None,
) -> Dict[str, Any]:
    """
    Generate evidence-based health recommendations and outdoor activity advisories.
    Provides practical, non-diagnostic guidance according to CPCB thresholds.
    """
    # Category thresholds reference
    aqi_thresholds = [
        {"range": "0 - 50", "category": "Good", "color": "#10b981", "badge": "Optimal"},
        {"range": "51 - 100", "category": "Satisfactory", "color": "#84cc16", "badge": "Acceptable"},
        {"range": "101 - 200", "category": "Moderate", "color": "#f59e0b", "badge": "Caution for Sensitive"},
        {"range": "201 - 300", "category": "Poor", "color": "#f97316", "badge": "Unhealthy"},
        {"range": "301 - 400", "category": "Very Poor", "color": "#ef4444", "badge": "Hazardous"},
        {"range": "401 - 500", "category": "Severe", "color": "#7f1d1d", "badge": "Emergency"},
    ]

    # Category guidance matrix
    guidance_matrix = {
        "Good": {
            "outdoor_activity": "safe",
            "exercise": "All outdoor activities and strenuous workouts are completely safe. Perfect for open-air exercise.",
            "mask_required": False,
            "mask_recommendation": "No respiratory mask needed.",
            "windows": "Keep windows wide open for natural cross-ventilation and fresh air flow.",
            "general_advice": "Air quality is pristine. Zero air-pollution health hazards for all demographic groups.",
            "school_sports": "Full outdoor sports, physical training, and recess sessions are strongly encouraged.",
            "travel_advisory": "Ideal traveling conditions with clear atmospheric visibility.",
        },
        "Satisfactory": {
            "outdoor_activity": "safe",
            "exercise": "Safe for regular outdoor jogging, cycling, and walking. Sensitive individuals should observe minor symptoms.",
            "mask_required": False,
            "mask_recommendation": "Masks optional; not required for general public.",
            "windows": "Natural ventilation is safe and recommended throughout the day.",
            "general_advice": "Air quality is acceptable. Only unusually sensitive individuals may notice mild throat dryness.",
            "school_sports": "Outdoor games and athletics can proceed normally.",
            "travel_advisory": "Safe travel conditions with no ambient air restrictions.",
        },
        "Moderate": {
            "outdoor_activity": "caution",
            "exercise": "Reduce prolonged or heavy outdoor cardio workouts. Consider taking frequent rest intervals.",
            "mask_required": False,
            "mask_recommendation": "N95 recommended only for patients with chronic respiratory or cardiac conditions.",
            "windows": "Close windows during morning and evening rush hour pollution peaks.",
            "general_advice": "Sensitive groups (asthmatics, elderly, children) should reduce prolonged roadside exposure.",
            "school_sports": "Moderate intensity sports permitted. Keep high-intensity endurance running brief.",
            "travel_advisory": "Keep vehicle windows closed in dense urban traffic; activate recirculate mode.",
        },
        "Poor": {
            "outdoor_activity": "avoid_prolonged",
            "exercise": "Avoid prolonged outdoor running and cycling. Shift intense cardiovascular training indoors.",
            "mask_required": True,
            "mask_recommendation": "N95 or FFP2 certified particulate respirators advised for outdoor commutes.",
            "windows": "Keep windows sealed shut. Operate indoor HEPA air filtration if available.",
            "general_advice": "Breathing discomfort is likely on prolonged exposure. Healthy adults may feel throat irritation.",
            "school_sports": "Move sports and physical education classes into indoor gymnasiums or auditoriums.",
            "travel_advisory": "Ensure cabin air filters in cars and trains are operating with recirculated air.",
        },
        "Very Poor": {
            "outdoor_activity": "avoid",
            "exercise": "Strictly cancel outdoor running, cycling, and sports. Exercise strictly indoors in filtered environments.",
            "mask_required": True,
            "mask_recommendation": "N95 / N99 mask mandatory for all outdoor exposure.",
            "windows": "Seal all window cracks. Run air purifiers on high-performance mode 24/7.",
            "general_advice": "Significant respiratory illness risk on prolonged exposure. Severe distress for sensitive groups.",
            "school_sports": "Cancel all outdoor assemblies and sports. Keep children indoors.",
            "travel_advisory": "Avoid non-essential urban transit and road trips through heavily impacted corridors.",
        },
        "Severe": {
            "outdoor_activity": "strictly_avoid",
            "exercise": "Do not exercise outdoors under any circumstances. Rest indoors with active purification.",
            "mask_required": True,
            "mask_recommendation": "Fitted N99 / P100 respirator essential if venturing outside is unavoidable.",
            "windows": "Complete atmospheric lockdown. Wet towel drafts on doors and windows to prevent smog infiltration.",
            "general_advice": "Atmospheric Emergency: Dangerously high fine particulates. Even healthy individuals risk acute pulmonary stress.",
            "school_sports": "Recommend closure of schools or immediate shift to remote operations.",
            "travel_advisory": "Emergency transit only. Low visibility and toxic particulate smog hazards on highways.",
        },
    }

    norm_cat = category.strip() if category else "Moderate"
    guidance = guidance_matrix.get(norm_cat, guidance_matrix["Moderate"])

    # Pollutant-specific notes
    pollutant_notes = {
        "pm25": "Fine Particulate Matter (PM2.5): Particles smaller than 2.5 µm penetrate directly into alveolar capillaries and blood circulation, worsening asthma, COPD, and ischemic heart conditions.",
        "pm10": "Coarse Particulates (PM10): Dust, construction debris, and pollen accumulate in upper bronchial airways causing persistent coughing, pharyngitis, and eye stinging.",
        "no2": "Nitrogen Dioxide (NO2): Traffic combustion emissions cause acute bronchial spasms, bronchial hyper-reactivity, and reduced pulmonary function in children.",
        "so2": "Sulphur Dioxide (SO2): Industrial and refinery emissions trigger severe bronchoconstriction within minutes for asthmatic individuals.",
        "co": "Carbon Monoxide (CO): Binds to hemoglobin with 200x affinity compared to oxygen, causing fatigue, dizziness, and compromised reflexes.",
        "o3": "Ground-Level Ozone (O3): Photochemical smog formed in warm sunlight oxidizes lung tissue and triggers severe coughing spells during afternoon hours.",
        "nh3": "Ammonia (NH3): Alkaline gaseous contaminant irritating ocular and upper mucosal linings.",
    }

    # Outdoor activities matrix
    if aqi <= 50:
        act_status = [
            {"activity": "Outdoor Jogging / Running", "status": "Optimal", "allowed": True, "icon": "run", "notes": "Ideal air conditions. Full aerobic capacity."},
            {"activity": "Bicycle Commuting / Cycling", "status": "Optimal", "allowed": True, "icon": "bike", "notes": "Safe across all urban and rural routes."},
            {"activity": "Brisk Walking / Hiking", "status": "Optimal", "allowed": True, "icon": "walk", "notes": "Great atmospheric clarity and oxygenation."},
            {"activity": "School Sports & Athletics", "status": "Optimal", "allowed": True, "icon": "school", "notes": "Unrestricted physical activity encouraged."},
            {"activity": "Outdoor Yoga & Breathing (Pranayama)", "status": "Optimal", "allowed": True, "icon": "yoga", "notes": "Pure ambient air for deep respiratory training."}
        ]
    elif aqi <= 100:
        act_status = [
            {"activity": "Outdoor Jogging / Running", "status": "Safe", "allowed": True, "icon": "run", "notes": "Generally safe. Sensitive runners can take easy paces."},
            {"activity": "Bicycle Commuting / Cycling", "status": "Safe", "allowed": True, "icon": "bike", "notes": "Safe; avoid standing in dense diesel queues."},
            {"activity": "Brisk Walking / Hiking", "status": "Safe", "allowed": True, "icon": "walk", "notes": "No restrictions."},
            {"activity": "School Sports & Athletics", "status": "Safe", "allowed": True, "icon": "school", "notes": "Standard sports sessions permitted."},
            {"activity": "Outdoor Yoga & Breathing (Pranayama)", "status": "Safe", "allowed": True, "icon": "yoga", "notes": "Clean morning practice recommended."}
        ]
    elif aqi <= 200:
        act_status = [
            {"activity": "Outdoor Jogging / Running", "status": "Caution", "allowed": True, "icon": "run", "notes": "Cap runs at 30-40 min. Avoid heavy sprints along main corridors."},
            {"activity": "Bicycle Commuting / Cycling", "status": "Caution", "allowed": True, "icon": "bike", "notes": "Select quiet residential backstreets over highways."},
            {"activity": "Brisk Walking / Hiking", "status": "Safe", "allowed": True, "icon": "walk", "notes": "Light to moderate walks are completely acceptable."},
            {"activity": "School Sports & Athletics", "status": "Caution", "allowed": True, "icon": "school", "notes": "Take frequent water breaks; excuse asthmatic students."},
            {"activity": "Outdoor Yoga & Breathing (Pranayama)", "status": "Caution", "allowed": False, "icon": "yoga", "notes": "Practice indoors to avoid deep inhalation of fine particulate matter."}
        ]
    elif aqi <= 300:
        act_status = [
            {"activity": "Outdoor Jogging / Running", "status": "Avoid", "allowed": False, "icon": "run", "notes": "Switch to indoor treadmill or gym aerobics."},
            {"activity": "Bicycle Commuting / Cycling", "status": "Avoid", "allowed": False, "icon": "bike", "notes": "Wear certified N95 respirator if cycling to work."},
            {"activity": "Brisk Walking / Hiking", "status": "Restricted", "allowed": True, "icon": "walk", "notes": "Limit to short essential walks with protective mask."},
            {"activity": "School Sports & Athletics", "status": "Move Indoors", "allowed": False, "icon": "school", "notes": "Suspend all competitive outdoor games."},
            {"activity": "Outdoor Yoga & Breathing (Pranayama)", "status": "Prohibited", "allowed": False, "icon": "yoga", "notes": "Deep inhalation in polluted air can cause bronchiolar spasms."}
        ]
    elif aqi <= 400:
        act_status = [
            {"activity": "Outdoor Jogging / Running", "status": "Hazardous", "allowed": False, "icon": "run", "notes": "High risk of acute pulmonary distress and chest tightness."},
            {"activity": "Bicycle Commuting / Cycling", "status": "Hazardous", "allowed": False, "icon": "bike", "notes": "Strictly avoid open-air riding. Use closed public transit."},
            {"activity": "Brisk Walking / Hiking", "status": "Avoid", "allowed": False, "icon": "walk", "notes": "Essential outdoor transit only with N95/N99 mask."},
            {"activity": "School Sports & Athletics", "status": "Prohibited", "allowed": False, "icon": "school", "notes": "Cancel all physical activities and outdoor recess."},
            {"activity": "Outdoor Yoga & Breathing (Pranayama)", "status": "Prohibited", "allowed": False, "icon": "yoga", "notes": "Hazardous particulate concentration."}
        ]
    else:
        act_status = [
            {"activity": "Outdoor Jogging / Running", "status": "Severe Danger", "allowed": False, "icon": "run", "notes": "Extreme lung damage risk. Strictly prohibited."},
            {"activity": "Bicycle Commuting / Cycling", "status": "Severe Danger", "allowed": False, "icon": "bike", "notes": "Smog and toxic particulates pose emergency health threats."},
            {"activity": "Brisk Walking / Hiking", "status": "Strictly Avoid", "allowed": False, "icon": "walk", "notes": "Do not step outside without tight-seal respirator."},
            {"activity": "School Sports & Athletics", "status": "Emergency", "allowed": False, "icon": "school", "notes": "Schools should close or conduct classes remotely."},
            {"activity": "Outdoor Yoga & Breathing (Pranayama)", "status": "Severe Danger", "allowed": False, "icon": "yoga", "notes": "Extremely harmful to respiratory tissue."}
        ]

    # Vulnerable demographic guidance
    vulnerable_groups = [
        {
            "group": "Infants & Children",
            "risk_level": "Critical" if aqi > 200 else ("Elevated" if aqi > 100 else "Low"),
            "guidance": "Lungs still developing with 2x higher respiratory volume per kg body weight. Keep indoors in air-filtered spaces." if aqi > 150 else "Safe for outdoor playtime. Keep well hydrated.",
            "action": "Ensure classrooms and nurseries run HEPA filtration."
        },
        {
            "group": "Elderly Citizens (65+)",
            "risk_level": "Critical" if aqi > 250 else ("High" if aqi > 150 else "Moderate"),
            "guidance": "Elevated particulate counts increase stroke and cardiac ischemic events. Rest indoors and avoid cold morning walks." if aqi > 150 else "Morning strolls are pleasant and safe.",
            "action": "Check blood pressure and take regular prescribed cardiac medication."
        },
        {
            "group": "Asthma & Respiratory Patients",
            "risk_level": "Immediate Alert" if aqi > 100 else "Normal",
            "guidance": "Keep fast-acting rescue inhalers (salbutamol) within immediate reach. Avoid open-window rooms." if aqi > 100 else "Maintain regular preventative inhaler regimen.",
            "action": "Use peak-flow meters twice daily to catch early bronchospasms."
        },
        {
            "group": "Pregnant Women",
            "risk_level": "High" if aqi > 200 else ("Caution" if aqi > 100 else "Low"),
            "guidance": "Fine micro-particulates cross the placental barrier. Limit roadside exposure and traffic-dense corridors." if aqi > 150 else "Safe for normal daily walking and light exercise.",
            "action": "Utilize certified N95 masks when attending medical appointments."
        },
        {
            "group": "Outdoor Gig & Traffic Workers",
            "risk_level": "Extreme Occupational Risk" if aqi > 200 else ("Elevated" if aqi > 100 else "Standard"),
            "guidance": "Continuous 8-hour exposure requires employers to provide certified N95 respirators with replacement cartridges." if aqi > 150 else "Standard hydration and rest breaks.",
            "action": "Wash face and eyes with clean saline water after field shifts."
        }
    ]

    return {
        "aqi": aqi,
        "category": norm_cat,
        "dominant_pollutant": dominant_pollutant.lower(),
        "outdoor_activity_status": guidance["outdoor_activity"],
        "mask_required": guidance["mask_required"],
        "mask_recommendation": guidance["mask_recommendation"],
        "exercise_guidance": guidance["exercise"],
        "window_guidance": guidance["windows"],
        "general_advice": guidance["general_advice"],
        "school_sports_guidance": guidance["school_sports"],
        "travel_advisory": guidance["travel_advisory"],
        "pollutant_specific_note": pollutant_notes.get(dominant_pollutant.lower(), "Monitor overall particulate levels."),
        "activity_recommendations": act_status,
        "vulnerable_groups": vulnerable_groups,
        "threshold_reference": aqi_thresholds,
        "disclaimer": "This environmental advisory is generated for general public wellness and education based on CPCB NAQI guidelines. It does not replace individualized clinical advice from qualified medical doctors.",
        "source": "CPCB NAQI Standards & Indian National Ambient Health Framework",
    }
