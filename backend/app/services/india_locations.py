"""
Comprehensive India Geographic Directory covering all 28 States and 8 Union Territories.
Provides city listings, administrative capitals, coordinates, and CPCB monitoring station indicators.
"""
from typing import Dict, List, Any

INDIA_STATES_DATA: Dict[str, Dict[str, Any]] = {
    "Andhra Pradesh": {
        "capital": "Amaravati",
        "type": "State",
        "lat": 15.9129,
        "lng": 79.7400,
        "cities": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kurnool", "Rajahmundry", "Kakinada", "Nellore", "Anantapur", "Kadapa", "Eluru", "Ongole"]
    },
    "Arunachal Pradesh": {
        "capital": "Itanagar",
        "type": "State",
        "lat": 28.2180,
        "lng": 94.7278,
        "cities": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Tezu"]
    },
    "Assam": {
        "capital": "Dispur",
        "type": "State",
        "lat": 26.2006,
        "lng": 92.9376,
        "cities": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "Goalpara", "Sivasagar"]
    },
    "Bihar": {
        "capital": "Patna",
        "type": "State",
        "lat": 25.0961,
        "lng": 85.3131,
        "cities": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra", "Sasaram"]
    },
    "Chhattisgarh": {
        "capital": "Raipur",
        "type": "State",
        "lat": 21.2787,
        "lng": 81.8661,
        "cities": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari"]
    },
    "Goa": {
        "capital": "Panaji",
        "type": "State",
        "lat": 15.2993,
        "lng": 74.1240,
        "cities": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem"]
    },
    "Gujarat": {
        "capital": "Gandhinagar",
        "type": "State",
        "lat": 22.2587,
        "lng": 71.1924,
        "cities": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Bharuch", "Morbi", "Vapi"]
    },
    "Haryana": {
        "capital": "Chandigarh",
        "type": "State",
        "lat": 29.0588,
        "lng": 76.0856,
        "cities": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Rewari", "Sirsa"]
    },
    "Himachal Pradesh": {
        "capital": "Shimla",
        "type": "State",
        "lat": 31.1048,
        "lng": 77.1734,
        "cities": ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu", "Baddi", "Una", "Nahan", "Hamirpur", "Bilaspur"]
    },
    "Jharkhand": {
        "capital": "Ranchi",
        "type": "State",
        "lat": 23.6102,
        "lng": 85.2799,
        "cities": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar"]
    },
    "Karnataka": {
        "capital": "Bengaluru",
        "type": "State",
        "lat": 15.3173,
        "lng": 75.7139,
        "cities": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli-Dharwad", "Belagavi", "Kalaburagi", "Davangere", "Ballari", "Vijayapura", "Shivamogga", "Tumakuru", "Udupi"]
    },
    "Kerala": {
        "capital": "Thiruvananthapuram",
        "type": "State",
        "lat": 10.8505,
        "lng": 76.2711,
        "cities": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam", "Kasaragod", "Malappuram"]
    },
    "Madhya Pradesh": {
        "capital": "Bhopal",
        "type": "State",
        "lat": 22.9734,
        "lng": 78.6569,
        "cities": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Singrauli", "Katni"]
    },
    "Maharashtra": {
        "capital": "Mumbai",
        "type": "State",
        "lat": 19.7515,
        "lng": 75.7139,
        "cities": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Thane", "Vasai-Virar", "Malegaon", "Navi Mumbai", "Amravati", "Nanded"]
    },
    "Manipur": {
        "capital": "Imphal",
        "type": "State",
        "lat": 24.6637,
        "lng": 93.9063,
        "cities": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul"]
    },
    "Meghalaya": {
        "capital": "Shillong",
        "type": "State",
        "lat": 25.4670,
        "lng": 91.3662,
        "cities": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara"]
    },
    "Mizoram": {
        "capital": "Aizawl",
        "type": "State",
        "lat": 23.1645,
        "lng": 92.9376,
        "cities": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai"]
    },
    "Nagaland": {
        "capital": "Kohima",
        "type": "State",
        "lat": 26.1584,
        "lng": 94.5624,
        "cities": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Mon"]
    },
    "Odisha": {
        "capital": "Bhubaneswar",
        "type": "State",
        "lat": 20.9517,
        "lng": 85.0985,
        "cities": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Baripada", "Bhadrak", "Angul"]
    },
    "Punjab": {
        "capital": "Chandigarh",
        "type": "State",
        "lat": 31.1471,
        "lng": 75.3412,
        "cities": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Pathankot", "Hoshiarpur", "Batala", "Mohali", "Moga", "Abohar", "Khanna"]
    },
    "Rajasthan": {
        "capital": "Jaipur",
        "type": "State",
        "lat": 27.0238,
        "lng": 74.2179,
        "cities": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar", "Pali", "Sri Ganganagar"]
    },
    "Sikkim": {
        "capital": "Gangtok",
        "type": "State",
        "lat": 27.5330,
        "lng": 88.5122,
        "cities": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Singtam", "Rangpo"]
    },
    "Tamil Nadu": {
        "capital": "Chennai",
        "type": "State",
        "lat": 11.1271,
        "lng": 78.6569,
        "cities": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Tiruppur", "Erode", "Thoothukudi", "Dindigul", "Thanjavur"]
    },
    "Telangana": {
        "capital": "Hyderabad",
        "type": "State",
        "lat": 18.1124,
        "lng": 79.0193,
        "cities": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"]
    },
    "Tripura": {
        "capital": "Agartala",
        "type": "State",
        "lat": 23.9408,
        "lng": 91.9882,
        "cities": ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar", "Belonia", "Khowai"]
    },
    "Uttar Pradesh": {
        "capital": "Lucknow",
        "type": "State",
        "lat": 26.8467,
        "lng": 80.9462,
        "cities": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Noida", "Saharanpur", "Gorakhpur", "Firozabad", "Jhansi", "Mathura", "Ayodhya"]
    },
    "Uttarakhand": {
        "capital": "Dehradun",
        "type": "State",
        "lat": 30.0668,
        "lng": 79.0193,
        "cities": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Nainital", "Pithoragarh", "Almora"]
    },
    "West Bengal": {
        "capital": "Kolkata",
        "type": "State",
        "lat": 22.9868,
        "lng": 87.8550,
        "cities": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Barasat", "Krishnanagar", "Howrah", "Haldia", "Kharagpur", "Darjeeling"]
    },
    "Delhi": {
        "capital": "New Delhi",
        "type": "Union Territory",
        "lat": 28.6139,
        "lng": 77.2090,
        "cities": ["Delhi", "New Delhi", "Dwarka", "Rohini", "Anand Vihar", "Saket", "Punjabi Bagh", "RK Puram", "ITO", "Connaught Place"]
    },
    "Jammu and Kashmir": {
        "capital": "Srinagar",
        "type": "Union Territory",
        "lat": 33.7782,
        "lng": 76.5762,
        "cities": ["Srinagar", "Jammu", "Anantnag", "Sopore", "Baramulla", "Udhampur", "Kathua", "Pulwama"]
    },
    "Ladakh": {
        "capital": "Leh",
        "type": "Union Territory",
        "lat": 34.1526,
        "lng": 77.5770,
        "cities": ["Leh", "Kargil", "Diskit", "Nyoma"]
    },
    "Chandigarh": {
        "capital": "Chandigarh",
        "type": "Union Territory",
        "lat": 30.7333,
        "lng": 76.7794,
        "cities": ["Chandigarh", "Sector 17", "Sector 22", "Manimajra"]
    },
    "Dadra and Nagar Haveli and Daman and Diu": {
        "capital": "Daman",
        "type": "Union Territory",
        "lat": 20.1809,
        "lng": 73.0169,
        "cities": ["Silvassa", "Daman", "Diu"]
    },
    "Lakshadweep": {
        "capital": "Kavaratti",
        "type": "Union Territory",
        "lat": 10.5667,
        "lng": 72.6417,
        "cities": ["Kavaratti", "Agatti", "Amini", "Andrott", "Minicoy"]
    },
    "Puducherry": {
        "capital": "Puducherry",
        "type": "Union Territory",
        "lat": 11.9416,
        "lng": 79.8083,
        "cities": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
    },
    "Andaman and Nicobar Islands": {
        "capital": "Port Blair",
        "type": "Union Territory",
        "lat": 11.7401,
        "lng": 92.6586,
        "cities": ["Port Blair", "Diglipur", "Car Nicobar", "Havelock Island", "Mayabunder"]
    },
}

# Cities known to have official continuous ambient air monitoring (CPCB / CAAQMS)
MONITORED_CITIES = {
    "Delhi", "New Delhi", "Dwarka", "Rohini", "Anand Vihar", "Punjabi Bagh", "RK Puram", "ITO",
    "Lucknow", "Prayagraj", "Kanpur", "Varanasi", "Agra", "Ghaziabad", "Noida", "Meerut", "Moradabad", "Bareilly", "Aligarh", "Gorakhpur", "Firozabad", "Saharanpur", "Jhansi",
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Thane", "Navi Mumbai", "Amravati",
    "Bengaluru", "Mysuru", "Mangaluru", "Hubli-Dharwad", "Belagavi",
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar",
    "Visakhapatnam", "Vijayawada", "Tirupati", "Guntur",
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Kolkata", "Asansol", "Durgapur", "Siliguri", "Howrah",
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Vapi",
    "Jaipur", "Jodhpur", "Kota", "Ajmer", "Udaipur", "Alwar",
    "Patna", "Gaya", "Muzaffarpur", "Bhagalpur",
    "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Singrauli",
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro",
    "Raipur", "Bhilai", "Bilaspur", "Korba",
    "Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala",
    "Dehradun", "Haridwar", "Rishikesh", "Kashipur",
    "Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal", "Sonipat",
    "Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur",
    "Bhubaneswar", "Cuttack", "Rourkela",
    "Srinagar", "Jammu", "Shillong", "Guwahati"
}


def get_all_states() -> List[str]:
    """Return sorted list of all 36 Indian states and Union Territories."""
    return sorted(INDIA_STATES_DATA.keys())


def get_cities_for_state(state: str) -> List[Dict[str, Any]]:
    """Return cities for a given state with real-time station availability flag."""
    data = INDIA_STATES_DATA.get(state)
    if not data:
        return []
    return [
        {
            "name": city,
            "state": state,
            "has_monitoring_station": city in MONITORED_CITIES,
            "latitude": data["lat"],
            "longitude": data["lng"],
        }
        for city in data["cities"]
    ]


def search_cities_india(query: str, limit: int = 20) -> List[Dict[str, Any]]:
    """Search Indian cities and districts by keyword with monitored station precedence."""
    query_lower = query.lower().strip()
    if not query_lower:
        return []
    results = []
    for state, data in INDIA_STATES_DATA.items():
        for city in data["cities"]:
            if query_lower in city.lower() or query_lower in state.lower():
                has_st = city in MONITORED_CITIES
                results.append({
                    "name": city,
                    "state": state,
                    "capital": data["capital"],
                    "has_monitoring_station": has_st,
                    "latitude": data["lat"],
                    "longitude": data["lng"],
                })
    return sorted(results, key=lambda x: (not x["has_monitoring_station"], x["name"]))[:limit]


def get_state_summary() -> List[Dict[str, Any]]:
    """Return all states with comprehensive city counts and monitoring coverage statistics."""
    summary = []
    for state, data in sorted(INDIA_STATES_DATA.items()):
        total = len(data["cities"])
        monitored = sum(1 for c in data["cities"] if c in MONITORED_CITIES)
        coverage_pct = round((monitored / total) * 100, 1) if total > 0 else 0
        summary.append({
            "state": state,
            "capital": data["capital"],
            "type": data.get("type", "State"),
            "total_cities": total,
            "monitored_cities": monitored,
            "coverage_percentage": coverage_pct,
            "latitude": data["lat"],
            "longitude": data["lng"],
        })
    return summary
