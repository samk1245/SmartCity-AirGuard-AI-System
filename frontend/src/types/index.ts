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
