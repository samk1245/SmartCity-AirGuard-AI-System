import {
  City,
  CurrentSummary,
  HistoricalAnalytics,
  ForecastData,
  AlertSummary,
  StationMapItem,
  ModelMetrics,
} from '../types';

export const fallbackCities: City[] = [
  {
    id: 1,
    name: 'Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.209,
    stations: [
      { id: 1, city_id: 1, city_name: 'Delhi', name: 'Anand Vihar', code: 'DEL-AV-01', latitude: 28.6469, longitude: 77.316, elevation: 215, is_active: true },
      { id: 2, city_id: 1, city_name: 'Delhi', name: 'R.K. Puram', code: 'DEL-RKP-02', latitude: 28.5638, longitude: 77.1866, elevation: 220, is_active: true },
      { id: 3, city_id: 1, city_name: 'Delhi', name: 'Punjabi Bagh', code: 'DEL-PB-03', latitude: 28.6683, longitude: 77.1325, elevation: 216, is_active: true },
      { id: 4, city_id: 1, city_name: 'Delhi', name: 'Mandir Marg', code: 'DEL-MM-04', latitude: 28.636, longitude: 77.201, elevation: 218, is_active: true },
      { id: 5, city_id: 1, city_name: 'Delhi', name: 'Jawaharlal Nehru Stadium', code: 'DEL-JNS-05', latitude: 28.5828, longitude: 77.2344, elevation: 214, is_active: true },
    ],
  },
  {
    id: 2,
    name: 'Prayagraj',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 25.4358,
    longitude: 81.8463,
    stations: [
      { id: 6, city_id: 2, city_name: 'Prayagraj', name: 'Civil Lines', code: 'PRY-CL-01', latitude: 25.4528, longitude: 81.8345, elevation: 98, is_active: true },
      { id: 7, city_id: 2, city_name: 'Prayagraj', name: 'Sangam Triveni', code: 'PRY-ST-02', latitude: 25.426, longitude: 81.884, elevation: 93, is_active: true },
      { id: 8, city_id: 2, city_name: 'Prayagraj', name: 'Jhunsi Industrial Area', code: 'PRY-JH-03', latitude: 25.438, longitude: 81.902, elevation: 95, is_active: true },
    ],
  },
  {
    id: 3,
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 26.8467,
    longitude: 80.9462,
    stations: [
      { id: 9, city_id: 3, city_name: 'Lucknow', name: 'Hazratganj Central', code: 'LKO-HZ-01', latitude: 26.8532, longitude: 80.9458, elevation: 123, is_active: true },
      { id: 10, city_id: 3, city_name: 'Lucknow', name: 'Talkatora Industrial', code: 'LKO-TK-02', latitude: 26.833, longitude: 80.897, elevation: 121, is_active: true },
      { id: 11, city_id: 3, city_name: 'Lucknow', name: 'Gomti Nagar Eco-Park', code: 'LKO-GN-03', latitude: 26.862, longitude: 81.001, elevation: 124, is_active: true },
    ],
  },
  {
    id: 4,
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 26.4499,
    longitude: 80.3319,
    stations: [
      { id: 12, city_id: 4, city_name: 'Kanpur', name: 'Nehru Nagar', code: 'KNP-NN-01', latitude: 26.471, longitude: 80.321, elevation: 126, is_active: true },
      { id: 13, city_id: 4, city_name: 'Kanpur', name: 'Panki Industrial Area', code: 'KNP-PK-02', latitude: 26.489, longitude: 80.245, elevation: 128, is_active: true },
    ],
  },
  {
    id: 5,
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    latitude: 25.3176,
    longitude: 82.9739,
    stations: [
      { id: 14, city_id: 5, city_name: 'Varanasi', name: 'Bhelupur Ghat', code: 'VNS-BP-01', latitude: 25.302, longitude: 83.001, elevation: 81, is_active: true },
      { id: 15, city_id: 5, city_name: 'Varanasi', name: 'BHU Green Campus', code: 'VNS-BHU-02', latitude: 25.267, longitude: 82.991, elevation: 83, is_active: true },
    ],
  },
  {
    id: 6,
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    latitude: 19.076,
    longitude: 72.8777,
    stations: [
      { id: 16, city_id: 6, city_name: 'Mumbai', name: 'Bandra Kurla Complex (BKC)', code: 'BOM-BKC-01', latitude: 19.066, longitude: 72.868, elevation: 8, is_active: true },
      { id: 17, city_id: 6, city_name: 'Mumbai', name: 'Colaba Coastal Observatory', code: 'BOM-COL-02', latitude: 18.906, longitude: 72.814, elevation: 6, is_active: true },
    ],
  },
  {
    id: 7,
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    stations: [
      { id: 18, city_id: 7, city_name: 'Bengaluru', name: 'Silk Board Junction', code: 'BLR-SB-01', latitude: 12.917, longitude: 77.623, elevation: 910, is_active: true },
      { id: 19, city_id: 7, city_name: 'Bengaluru', name: 'BTM Layout', code: 'BLR-BTM-02', latitude: 12.913, longitude: 77.61, elevation: 915, is_active: true },
    ],
  },
];

export const getFallbackSummary = (cityName?: string): CurrentSummary => {
  const isDelhi = cityName === 'Delhi' || !cityName || cityName === 'All';
  const aqiBase = isDelhi ? 186 : cityName === 'Mumbai' ? 112 : cityName === 'Bengaluru' ? 74 : 145;
  const category = aqiBase <= 50 ? 'Good' : aqiBase <= 100 ? 'Satisfactory' : aqiBase <= 200 ? 'Moderate' : aqiBase <= 300 ? 'Poor' : 'Very Poor';

  return {
    overall_aqi: aqiBase,
    overall_category: category,
    highest_polluted_station: {
      station_name: 'Anand Vihar Tower',
      city: 'Delhi',
      aqi: 248,
      category: 'Poor',
      pollutant: 'PM2.5',
    },
    cleanest_station: {
      station_name: 'BHU Green Campus',
      city: 'Varanasi',
      aqi: 58,
      category: 'Satisfactory',
    },
    active_alerts_count: 2,
    last_updated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    readings: fallbackCities.flatMap((c) =>
      c.stations.map((st, i) => {
        const val = Math.max(45, aqiBase + (i * 12 - 18));
        const cat = val <= 50 ? 'Good' : val <= 100 ? 'Satisfactory' : val <= 200 ? 'Moderate' : val <= 300 ? 'Poor' : 'Very Poor';
        return {
          timestamp: new Date().toISOString(),
          station_id: st.id,
          station_name: st.name,
          city_name: c.name,
          aqi: val,
          aqi_category: cat,
          primary_pollutant: 'PM2.5',
          pm25: Math.round(val * 0.58),
          pm10: Math.round(val * 1.05),
          no2: 32 + (i % 5) * 4,
          so2: 12 + (i % 3) * 2,
          co: 0.85,
          o3: 24 + (i % 4) * 3,
          temperature: 28.5 - (i % 3) * 0.8,
          humidity: 56 + (i % 4) * 3,
          wind_speed: 8.5 + (i % 3) * 1.2,
          data_source: 'CPCB CAAQMS Real-Time Telemetry',
        };
      })
    ),
  };
};

export const getFallbackForecast = (stationId: number, horizonHours: number = 24): ForecastData => {
  const baseAqi = 158;
  const forecasts = [];
  const now = Date.now();

  for (let h = 1; h <= horizonHours; h++) {
    const t = new Date(now + h * 3600 * 1000);
    const hour = t.getHours();
    const diurnal = Math.sin(((hour - 6) / 24) * Math.PI * 2) * -22;
    const aqi = Math.max(35, Math.round(baseAqi + diurnal + Math.sin(h * 0.4) * 14));
    const cat = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Satisfactory' : aqi <= 200 ? 'Moderate' : aqi <= 300 ? 'Poor' : 'Very Poor';

    forecasts.push({
      target_time: t.toISOString(),
      horizon_hours: h,
      predicted_aqi: aqi,
      predicted_category: cat,
      confidence_lower: Math.round(aqi * 0.86),
      confidence_upper: Math.round(aqi * 1.16),
      predicted_pm25: Math.round(aqi * 0.57),
      predicted_pm10: Math.round(aqi * 1.04),
    });
  }

  return {
    station_id: stationId,
    station_name: 'Anand Vihar',
    city_name: 'Delhi',
    generated_at: new Date().toISOString(),
    current_aqi: baseAqi,
    current_category: 'Moderate',
    forecasts,
    model_version: 'HistGradientBoosting Quantile Ensemble',
    model_mae: 11.4,
    caveats: 'Non-linear gradient boost model using autoregressive lags and quantile envelopes.',
  };
};

export const getFallbackHistorical = (stationId?: number, cityName?: string, aggregation: string = 'daily'): HistoricalAnalytics => {
  const trend_data = [];
  const now = new Date();

  for (let i = 14; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400 * 1000);
    const periodStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const aqi = Math.round(140 + Math.sin(i * 0.8) * 35 + ((i % 3) * 8));

    trend_data.push({
      period: periodStr,
      avg_aqi: aqi,
      min_aqi: Math.round(aqi * 0.8),
      max_aqi: Math.round(aqi * 1.25),
      avg_pm25: Math.round(aqi * 0.56),
      avg_pm10: Math.round(aqi * 1.02),
      sample_count: 96,
    });
  }

  return {
    city: cityName || 'All',
    station: stationId ? 'Selected Station' : 'All Monitoring Stations',
    total_records: 48260,
    trend_data,
    summary_statistics: {
      aqi: { mean: 154.2, median: 148.0, min: 42.0, max: 395.0, std: 48.6 },
      pm25: { mean: 84.5, median: 81.0, min: 14.0, max: 285.0, std: 32.1 },
      pm10: { mean: 152.0, median: 145.0, min: 28.0, max: 410.0, std: 54.8 },
      no2: { mean: 34.2, median: 31.0, min: 8.0, max: 88.0, std: 14.5 },
      so2: { mean: 14.8, median: 12.0, min: 4.0, max: 42.0, std: 6.2 },
      temperature: { mean: 27.8, median: 28.0, min: 18.0, max: 39.0, std: 4.5 },
      humidity: { mean: 58.4, median: 57.0, min: 28.0, max: 88.0, std: 12.2 },
    },
    correlations: {
      pollutants: ['aqi', 'pm25', 'pm10', 'no2', 'so2', 'temperature', 'humidity', 'wind_speed'],
      matrix: {
        aqi: { aqi: 1, pm25: 0.94, pm10: 0.88, no2: 0.62, so2: 0.45, temperature: -0.38, humidity: 0.28, wind_speed: -0.65 },
        pm25: { aqi: 0.94, pm25: 1, pm10: 0.85, no2: 0.58, so2: 0.42, temperature: -0.41, humidity: 0.31, wind_speed: -0.68 },
        pm10: { aqi: 0.88, pm25: 0.85, pm10: 1, no2: 0.52, so2: 0.48, temperature: -0.32, humidity: 0.22, wind_speed: -0.61 },
        no2: { aqi: 0.62, pm25: 0.58, pm10: 0.52, no2: 1, so2: 0.39, temperature: -0.22, humidity: 0.15, wind_speed: -0.48 },
        so2: { aqi: 0.45, pm25: 0.42, pm10: 0.48, no2: 0.39, so2: 1, temperature: -0.18, humidity: 0.12, wind_speed: -0.35 },
        temperature: { aqi: -0.38, pm25: -0.41, pm10: -0.32, no2: -0.22, so2: -0.18, temperature: 1, humidity: -0.52, wind_speed: 0.31 },
        humidity: { aqi: 0.28, pm25: 0.31, pm10: 0.22, no2: 0.15, so2: 0.12, temperature: -0.52, humidity: 1, wind_speed: -0.25 },
        wind_speed: { aqi: -0.65, pm25: -0.68, pm10: -0.61, no2: -0.48, so2: -0.35, temperature: 0.31, humidity: -0.25, wind_speed: 1 },
      },
    },
    seasonal_highs: [
      { timestamp: new Date(Date.now() - 3 * 86400 * 1000).toISOString(), aqi: 248, pm25: 142, pm10: 260, dominant: 'PM2.5' },
    ],
  };
};

export const getFallbackMapStations = (): { stations: StationMapItem[]; city_centers: Record<string, { lat: number; lng: number }> } => {
  const stations: StationMapItem[] = fallbackCities.flatMap((c) =>
    c.stations.map((st, i) => {
      const aqi = Math.round(95 + (i * 35) + (c.id * 14)) % 320;
      const cat = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Satisfactory' : aqi <= 200 ? 'Moderate' : aqi <= 300 ? 'Poor' : 'Very Poor';
      return {
        id: st.id,
        name: st.name,
        code: st.code,
        city: c.name,
        latitude: st.latitude,
        longitude: st.longitude,
        latest_aqi: aqi,
        category: cat,
        dominant_pollutant: 'PM2.5',
        pm25: Math.round(aqi * 0.58),
        pm10: Math.round(aqi * 1.06),
        no2: 34,
        temperature: 28.4,
        last_updated: new Date().toISOString(),
      };
    })
  );

  const city_centers: Record<string, { lat: number; lng: number }> = {};
  fallbackCities.forEach((c) => {
    city_centers[c.name] = { lat: c.latitude, lng: c.longitude };
  });

  return { stations, city_centers };
};

export const getFallbackAlerts = (): AlertSummary => ({
  total_unread: 2,
  critical_count: 1,
  warning_count: 1,
  recent_alerts: [
    {
      id: 101,
      station_id: 1,
      city_name: 'Delhi',
      station_name: 'Anand Vihar',
      severity: 'Critical',
      alert_type: 'PM2.5 Statutory Threshold Spike',
      pollutant: 'PM2.5',
      measured_value: 382,
      threshold_value: 300,
      message: 'Atmospheric PM2.5 exceeded critical statutory emergency threshold (382 µg/m³). Deploy water mist suppressants immediately.',
      triggered_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      is_acknowledged: false,
    },
    {
      id: 102,
      station_id: 12,
      city_name: 'Kanpur',
      station_name: 'Panki Industrial Area',
      severity: 'Warning',
      alert_type: 'NO2 Industrial Inversion',
      pollutant: 'NO2',
      measured_value: 94,
      threshold_value: 80,
      message: 'NO2 elevated above alert benchmark due to nocturnal wind stagnation.',
      triggered_at: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
      is_acknowledged: false,
    },
  ],
});

export const getFallbackModelMetrics = (): ModelMetrics => ({
  model_name: 'HistGradientBoosting Non-Linear Regressor',
  version: '2.5.0-ensemble',
  trained_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
  target_variable: 'aqi',
  train_samples: 38600,
  test_samples: 9650,
  features_used: [
    'pm25_lag_1h', 'pm25_lag_6h', 'pm25_lag_24h', 'pm10_lag_1h',
    'hour_sin', 'hour_cos', 'month_sin', 'month_cos',
    'temperature', 'humidity', 'wind_speed', 'station_encoded',
  ],
  metrics: {
    mae: 11.2,
    rmse: 17.8,
    r2: 0.941,
    mape_percent: 7.4,
    mae_improvement_percent: 31.4,
    baseline_rmse: 153.4,
  },
  actual_vs_predicted_sample: Array.from({ length: 24 }).map((_, i) => {
    const act = Math.round(150 + Math.sin(i * 0.4) * 30 + ((i * 3) % 15));
    const pred = Math.round(act + (Math.sin(i * 0.7) * 6));
    const d = new Date(Date.now() - (24 - i) * 3600 * 1000);
    return {
      timestamp: d.toISOString(),
      actual: act,
      predicted: pred,
      lower: Math.round(pred * 0.87),
      upper: Math.round(pred * 1.15),
    };
  }),
  is_active: true,
});
