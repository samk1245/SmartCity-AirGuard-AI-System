import {
  City,
  CurrentSummary,
  HistoricalAnalytics,
  ForecastData,
  AlertSummary,
  AlertItem,
  StationMapItem,
  ModelMetrics,
  LiveAtmosphericData,
  GeocodingResult,
  GlobePoint,
  AIInsights,
  StreetViewMetadata
} from '../types';

const API_BASE = '/api';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  // Locations
  async getLocations(): Promise<City[]> {
    const res = await fetch(`${API_BASE}/locations`);
    if (!res.ok) throw new Error('Failed to load locations');
    return res.json();
  },

  // Current Air Quality
  async getCurrentAirQuality(cityName?: string, stationId?: number): Promise<CurrentSummary> {
    const params = new URLSearchParams();
    if (cityName && cityName !== 'All') params.append('city_name', cityName);
    if (stationId) params.append('station_id', stationId.toString());
    const res = await fetch(`${API_BASE}/air-quality/current?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch current air quality');
    return res.json();
  },

  // Historical Analytics Summary
  async getHistoricalSummary(
    stationId?: number,
    cityName?: string,
    aggregation: string = 'daily',
    startDate?: string,
    endDate?: string
  ): Promise<HistoricalAnalytics> {
    const params = new URLSearchParams({ aggregation });
    if (stationId) params.append('station_id', stationId.toString());
    if (cityName && cityName !== 'All') params.append('city_name', cityName);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const res = await fetch(`${API_BASE}/air-quality/summary?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch historical analytics');
    return res.json();
  },

  // Forecast
  async getForecast(stationId: number, horizonHours: number = 24): Promise<ForecastData> {
    const res = await fetch(
      `${API_BASE}/predictions/forecast?station_id=${stationId}&horizon_hours=${horizonHours}`,
      { method: 'POST' }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to generate forecast' }));
      throw new Error(err.detail || 'Failed to generate forecast');
    }
    return res.json();
  },

  // Alerts
  async getAlerts(severity?: string, isAcknowledged?: boolean): Promise<AlertSummary> {
    const params = new URLSearchParams();
    if (severity && severity !== 'All') params.append('severity', severity);
    if (isAcknowledged !== undefined) params.append('is_acknowledged', isAcknowledged.toString());
    const res = await fetch(`${API_BASE}/alerts?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async acknowledgeAlert(alertId: number): Promise<AlertItem> {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to acknowledge alert');
    return res.json();
  },

  // Map Stations
  async getMapStations(cityName?: string): Promise<{ stations: StationMapItem[]; city_centers: Record<string, { lat: number; lng: number }> }> {
    const params = new URLSearchParams();
    if (cityName && cityName !== 'All') params.append('city_name', cityName);
    const res = await fetch(`${API_BASE}/map/stations?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch map stations');
    return res.json();
  },

  // ML Models
  async getModelMetrics(): Promise<ModelMetrics> {
    const res = await fetch(`${API_BASE}/models/metrics`);
    if (!res.ok) throw new Error('Failed to fetch model metrics');
    return res.json();
  },

  async triggerTrainModel(modelType: string = 'HistGradientBoosting'): Promise<any> {
    const res = await fetch(`${API_BASE}/models/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model_type: modelType, test_size_ratio: 0.2, target_pollutant: 'aqi' })
    });
    if (!res.ok) throw new Error('Model training request failed');
    return res.json();
  },

  // Upload CSV
  async uploadDataset(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/data/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Dataset upload failed');
    }
    return res.json();
  },

  // Export CSV URL
  getExportUrl(stationId?: number, cityName?: string) {
    const params = new URLSearchParams();
    if (stationId) params.append('station_id', stationId.toString());
    if (cityName && cityName !== 'All') params.append('city_name', cityName);
    return `${API_BASE}/data/export?${params.toString()}`;
  },

  // Live Location & Coordinates Air Quality
  async getLiveLocationAirQuality(lat: number, lng: number, cityName?: string): Promise<LiveAtmosphericData> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
    if (cityName) params.append('city_name', cityName);
    const res = await fetch(`${API_BASE}/live-location/air-quality?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch live location air quality');
    return res.json();
  },

  // Location Geocoding Search
  async searchLocations(query: string): Promise<GeocodingResult[]> {
    if (!query || query.trim().length < 2) return [];
    const params = new URLSearchParams({ query: query.trim() });
    const res = await fetch(`${API_BASE}/live-location/search?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to search locations');
    return res.json();
  },

  // 3D Earth Globe Coordinates & AQI Points
  async getGlobePoints(): Promise<GlobePoint[]> {
    const res = await fetch(`${API_BASE}/globe/points`);
    if (!res.ok) throw new Error('Failed to fetch 3D globe points');
    return res.json();
  },

  // AI Environmental Insights & Health Advisor
  async getAiInsights(params: {
    locationName?: string;
    aqi: number;
    category?: string;
    dominantPollutant?: string;
    pm25?: number;
    pm10?: number;
    no2?: number;
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
  }): Promise<AIInsights> {
    const query = new URLSearchParams({
      aqi: params.aqi.toString(),
      location_name: params.locationName || 'Current Location',
      category: params.category || 'Moderate',
      dominant_pollutant: params.dominantPollutant || 'PM2.5',
    });
    if (params.pm25 !== undefined) query.append('pm25', params.pm25.toString());
    if (params.pm10 !== undefined) query.append('pm10', params.pm10.toString());
    if (params.no2 !== undefined) query.append('no2', params.no2.toString());
    if (params.temperature !== undefined) query.append('temperature', params.temperature.toString());
    if (params.humidity !== undefined) query.append('humidity', params.humidity.toString());
    if (params.windSpeed !== undefined) query.append('wind_speed', params.windSpeed.toString());

    const res = await fetch(`${API_BASE}/ai/insights?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to generate AI insights');
    return res.json();
  },

  // Street View Metadata & Embed
  async getStreetViewMetadata(lat: number, lng: number, cityName?: string): Promise<StreetViewMetadata> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
    if (cityName) params.append('city_name', cityName);
    const res = await fetch(`${API_BASE}/streetview/metadata?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch street view metadata');
    return res.json();
  }
};
