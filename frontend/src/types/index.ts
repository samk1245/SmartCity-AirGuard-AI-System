export interface Station {
  id: number;
  city_id: number;
  city_name: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  elevation: number;
  is_active: boolean;
}

export interface City {
  id: number;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  stations: Station[];
}

export interface AirQualityReading {
  timestamp: string;
  station_id: number;
  station_name: string;
  city_name: string;
  aqi: number;
  aqi_category: string;
  primary_pollutant: string;
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  rainfall?: number;
  data_source?: string;
}

export interface CurrentSummary {
  overall_aqi: number;
  overall_category: string;
  highest_polluted_station?: {
    station_name: string;
    city: string;
    aqi: number;
    category: string;
    pollutant: string;
  };
  cleanest_station?: {
    station_name: string;
    city: string;
    aqi: number;
    category: string;
  };
  readings: AirQualityReading[];
  last_updated: string;
  active_alerts_count: number;
}

export interface TrendPoint {
  period: string;
  avg_aqi: number;
  min_aqi: number;
  max_aqi: number;
  avg_pm25?: number;
  avg_pm10?: number;
  avg_no2?: number;
  sample_count: number;
}

export interface HistoricalAnalytics {
  city?: string;
  station?: string;
  total_records: number;
  start_time?: string;
  end_time?: string;
  summary_statistics: Record<string, { mean: number; min: number; max: number; std: number; median: number }>;
  trend_data: TrendPoint[];
  correlations?: {
    pollutants: string[];
    matrix: Record<string, Record<string, number>>;
  };
  seasonal_highs: Array<{
    timestamp: string;
    aqi: number;
    pm25: number;
    pm10: number;
    dominant: string;
  }>;
}

export interface ForecastPoint {
  target_time: string;
  horizon_hours: number;
  predicted_aqi: number;
  predicted_category: string;
  confidence_lower?: number;
  confidence_upper?: number;
  predicted_pm25?: number;
  predicted_pm10?: number;
}

export interface ForecastData {
  station_id: number;
  station_name: string;
  city_name: string;
  generated_at: string;
  model_version: string;
  current_aqi: number;
  current_category: string;
  forecasts: ForecastPoint[];
  model_r2?: number;
  model_mae?: number;
  caveats: string;
}

export interface AlertItem {
  id: number;
  station_id: number;
  city_name: string;
  station_name: string;
  severity: "Info" | "Warning" | "Danger" | "Critical";
  alert_type: string;
  pollutant: string;
  measured_value: number;
  threshold_value: number;
  message: string;
  triggered_at: string;
  is_acknowledged: boolean;
  acknowledged_at?: string;
}

export interface AlertSummary {
  total_unread: number;
  critical_count: number;
  warning_count: number;
  recent_alerts: AlertItem[];
}

export interface StationMapItem {
  id: number;
  name: string;
  code: string;
  city: string;
  latitude: number;
  longitude: number;
  latest_aqi: number;
  category: string;
  dominant_pollutant: string;
  pm25?: number;
  pm10?: number;
  no2?: number;
  temperature?: number;
  last_updated: string;
}

export interface ModelMetrics {
  model_name: string;
  version: string;
  trained_at: string;
  target_variable: string;
  train_samples: number;
  test_samples: number;
  metrics: {
    mae: number;
    rmse: number;
    r2: number;
    mape_percent: number;
    baseline_mae?: number;
    baseline_rmse?: number;
    mae_improvement_percent?: number;
  };
  features_used: string[];
  actual_vs_predicted_sample: Array<{
    timestamp: string;
    actual: number;
    predicted: number;
    lower: number;
    upper: number;
  }>;
  is_active: boolean;
}

export interface LiveAtmosphericData {
  location: {
    city: string;
    latitude: number;
    longitude: number;
  };
  air_quality: {
    aqi: number;
    category: string;
    dominant_pollutant: string;
    pm25?: number;
    pm10?: number;
    no2?: number;
    so2?: number;
    co?: number;
    o3?: number;
    european_aqi?: number;
    us_aqi?: number;
    data_source: string;
    last_updated: string;
  };
  weather: {
    temperature: number;
    apparent_temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    precipitation: number;
    weather_code: number;
  };
  forecast_24h: Array<{
    time: string;
    predicted_aqi: number;
    category: string;
    pm25: number;
    pm10: number;
  }>;
  is_modeled: boolean;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone?: string;
}

export interface GlobePoint {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  position_3d: { x: number; y: number; z: number };
  aqi: number;
  category: string;
}

export interface AIInsights {
  location: string;
  aqi: number;
  category: string;
  generated_at: string;
  executive_summary: string;
  pollutant_assessment: string;
  meteorological_context: string;
  spike_risk: string;
  short_term_outlook: string;
  citizen_precautions: string[];
  confidence_score: number;
  source: string;
}

export interface StreetViewMetadata {
  latitude: number;
  longitude: number;
  city_name: string;
  has_custom_key: boolean;
  embed_url: string;
  external_link: string;
}

export interface ReverseGeocodeResult {
  display_name: string;
  short_name: string;
  road?: string;
  suburb?: string;
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
}

// ── India Geographic Directory Types ──
export interface StateSummary {
  state: string;
  capital: string;
  type: string;
  total_cities: number;
  monitored_cities: number;
  coverage_percentage: number;
  latitude: number;
  longitude: number;
}

export interface StateCityInfo {
  name: string;
  state: string;
  has_monitoring_station: boolean;
  latitude: number;
  longitude: number;
}

export interface IndiaCitySearchResult {
  name: string;
  state: string;
  capital: string;
  has_monitoring_station: boolean;
  latitude: number;
  longitude: number;
}

// ── Health Recommendations & Outdoor Activity Types ──
export interface ActivityItem {
  activity: string;
  status: string;
  allowed: boolean;
  icon: string;
  notes: string;
}

export interface VulnerableGroupItem {
  group: string;
  risk_level: string;
  guidance: string;
  action: string;
}

export interface ThresholdReferenceItem {
  range: string;
  category: string;
  color: string;
  badge: string;
}

export interface HealthRecommendationResponse {
  aqi: number;
  category: string;
  dominant_pollutant: string;
  outdoor_activity_status: string;
  mask_required: boolean;
  mask_recommendation: string;
  exercise_guidance: string;
  window_guidance: string;
  general_advice: string;
  school_sports_guidance: string;
  travel_advisory: string;
  pollutant_specific_note: string;
  activity_recommendations: ActivityItem[];
  vulnerable_groups: VulnerableGroupItem[];
  threshold_reference: ThresholdReferenceItem[];
  disclaimer: string;
  source: string;
}

// ── Nearby Monitoring Radar Types ──
export interface NearbyStationItem {
  station_id: number;
  station_name: string;
  city: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  aqi: number | null;
  category: string | null;
  pm25: number | null;
  pm10: number | null;
  timestamp: string | null;
}

export interface NearbyStationsResponse {
  latitude: number;
  longitude: number;
  radius_km: number;
  stations: NearbyStationItem[];
  total_found: number;
}

// ── India Pollution Scoreboard Types ──
export interface ScoreboardItem {
  city: string;
  state: string;
  average_aqi: number;
  category: string;
  station_count: number;
  latitude: number;
  longitude: number;
  data_coverage: string;
}

export interface ScoreboardResponse {
  scoreboard: ScoreboardItem[];
  sort_by: string;
  timestamp: string;
  methodology: string;
  note: string;
}

// ── Multi-City Air Quality Comparison Types ──
export interface CityComparisonStation {
  station: string;
  aqi: number;
  pm25: number;
  pm10: number;
  category: string;
  timestamp: string | null;
}

export interface CityComparisonItem {
  city: string;
  available: boolean;
  station_count?: number;
  average_aqi?: number;
  category?: string;
  stations?: CityComparisonStation[];
  error?: string;
}

export interface CityComparisonResponse {
  comparison: CityComparisonItem[];
  timestamp: string;
}
