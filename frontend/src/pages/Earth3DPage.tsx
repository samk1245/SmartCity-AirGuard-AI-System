import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Crosshair,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Navigation,
  Compass,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { ThreeDGlobe } from '../components/ThreeDGlobe';
import { api } from '../services/api';
import { GlobePoint, LiveAtmosphericData, GeocodingResult, AIInsights } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface Earth3DPageProps {
  onNavigateToStreetView?: (lat: number, lng: number, name: string) => void;
  onNavigateToMap?: (lat: number, lng: number) => void;
}

export const Earth3DPage: React.FC<Earth3DPageProps> = ({
  onNavigateToStreetView,
  onNavigateToMap,
}) => {
  const [globePoints, setGlobePoints] = useState<GlobePoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<GlobePoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [liveData, setLiveData] = useState<LiveAtmosphericData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [loadingAtmosphere, setLoadingAtmosphere] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Load initial 3D globe points
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const pts = await api.getGlobePoints();
        setGlobePoints(pts);
        if (pts.length > 0) {
          handleSelectCity(pts[0]);
        }
      } catch (err) {
        console.error('Failed to load globe points:', err);
      }
    };
    fetchPoints();
  }, []);

  // Fetch atmospheric data & AI insights whenever a point is selected
  const handleSelectCity = async (pt: GlobePoint | { name: string; latitude: number; longitude: number; country?: string }) => {
    setSelectedPoint({
      name: pt.name,
      country: pt.country || '',
      latitude: pt.latitude,
      longitude: pt.longitude,
      position_3d: { x: 0, y: 0, z: 0 },
      aqi: (pt as GlobePoint).aqi || 120,
      category: (pt as GlobePoint).category || 'Moderate',
    });

    try {
      setLoadingAtmosphere(true);
      setGeoError(null);
      const atm = await api.getLiveLocationAirQuality(pt.latitude, pt.longitude, pt.name);
      setLiveData(atm);

      // Fetch AI Insights
      const insights = await api.getAiInsights({
        locationName: pt.name,
        aqi: atm.air_quality.aqi,
        category: atm.air_quality.category,
        dominantPollutant: atm.air_quality.dominant_pollutant,
        pm25: atm.air_quality.pm25,
        pm10: atm.air_quality.pm10,
        no2: atm.air_quality.no2,
        temperature: atm.weather.temperature,
        humidity: atm.weather.humidity,
        windSpeed: atm.weather.wind_speed,
      });
      setAiInsights(insights);
    } catch (err) {
      console.error('Error fetching atmospheric data:', err);
      setGeoError('Failed to fetch real-time atmospheric data for this coordinate.');
    } finally {
      setLoadingAtmosphere(false);
    }
  };

  // Live browser geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoError(null);
    setLoadingAtmosphere(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await handleSelectCity({
          name: 'My Live GPS Location',
          country: 'Local Device',
          latitude,
          longitude,
        });
      },
      (err) => {
        setGeoError(`Location access denied or timed out (${err.message}).`);
        setLoadingAtmosphere(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Search autocomplete
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setIsSearching(true);
      try {
        const res = await api.searchLocations(q);
        setSearchResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = (result: GeocodingResult) => {
    setSearchResults([]);
    setSearchQuery('');
    handleSelectCity({
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                3D Interactive Earth & Atmosphere
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Global Telemetry
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Explore real-time planetary air quality, CPCB standard compliance, and micro-climate patterns in 3D WebGL.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Location Bar */}
        <div className="flex items-center gap-3 relative">
          <div className="relative w-64 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search worldwide city or coordinate..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {isSearching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cyan-400 animate-pulse">
                ...
              </span>
            )}

            {/* Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-800/80 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-white">{res.name}</span>
                      {res.admin1 && <span className="text-slate-400">, {res.admin1}</span>}
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">{res.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Use My Location Button */}
          <button
            onClick={handleUseMyLocation}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all shadow-md active:scale-95 whitespace-nowrap"
            title="Locate via GPS"
          >
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">My GPS Location</span>
          </button>
        </div>
      </div>

      {geoError && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Main Grid: 3D Globe + Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D WebGL Globe Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <ThreeDGlobe
            points={globePoints}
            selectedCityName={selectedPoint?.name}
            onSelectPoint={handleSelectCity}
            height="580px"
          />

          {/* Quick Megacity Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium mr-1">Quick Teleport:</span>
            {globePoints.slice(0, 8).map((pt) => (
              <button
                key={pt.name}
                onClick={() => handleSelectCity(pt)}
                className={`px-2.5 py-1 rounded-lg border transition-all font-medium ${
                  selectedPoint?.name === pt.name
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {pt.name}
              </button>
            ))}
          </div>
        </div>

        {/* Location Telemetry & AI Inspection Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Target Location Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Target Coordinate
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  {selectedPoint?.name || 'Select Location'}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedPoint ? `${selectedPoint.latitude.toFixed(4)}° N, ${selectedPoint.longitude.toFixed(4)}° E` : 'Worldwide'}
                </p>
              </div>

              {liveData && (
                <div
                  className="px-3 py-1.5 rounded-xl border text-center shadow-lg"
                  style={{
                    backgroundColor: `${liveData.air_quality.category === 'Good' ? '#065f46' : liveData.air_quality.category === 'Satisfactory' ? '#3f6212' : liveData.air_quality.category === 'Moderate' ? '#854d0e' : liveData.air_quality.category === 'Poor' ? '#9a3412' : '#991b1b'}30`,
                    borderColor: `${liveData.air_quality.category === 'Good' ? '#10b981' : liveData.air_quality.category === 'Satisfactory' ? '#84cc16' : liveData.air_quality.category === 'Moderate' ? '#eab308' : liveData.air_quality.category === 'Poor' ? '#f97316' : '#ef4444'}60`,
                  }}
                >
                  <div className="text-[10px] font-bold uppercase text-slate-300">CPCB AQI</div>
                  <div className="text-2xl font-black text-white">{liveData.air_quality.aqi}</div>
                  <div className="text-[10px] font-semibold text-cyan-300">
                    {liveData.air_quality.category}
                  </div>
                </div>
              )}
            </div>

            {loadingAtmosphere && (
              <div className="py-8 text-center text-xs text-slate-400 animate-pulse flex items-center justify-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Receiving atmospheric telemetry...</span>
              </div>
            )}

            {/* Pollutants Breakdown */}
            {liveData && !loadingAtmosphere && (
              <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-semibold">PM2.5</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {liveData.air_quality.pm25 ?? '--'}
                    <span className="text-[9px] text-slate-400 font-normal"> µg/m³</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-semibold">PM10</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {liveData.air_quality.pm10 ?? '--'}
                    <span className="text-[9px] text-slate-400 font-normal"> µg/m³</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-semibold">NO2</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {liveData.air_quality.no2 ?? '--'}
                    <span className="text-[9px] text-slate-400 font-normal"> µg/m³</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-semibold">SO2</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {liveData.air_quality.so2 ?? '--'}
                    <span className="text-[9px] text-slate-400 font-normal"> µg/m³</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-semibold">CO</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {liveData.air_quality.co ?? '--'}
                    <span className="text-[9px] text-slate-400 font-normal"> mg/m³</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400 font-semibold">O3 (Ozone)</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {liveData.air_quality.o3 ?? '--'}
                    <span className="text-[9px] text-slate-400 font-normal"> µg/m³</span>
                  </div>
                </div>
              </div>
            )}

            {/* Weather Covariates */}
            {liveData && !loadingAtmosphere && (
              <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>{liveData.weather.temperature}°C</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>{liveData.weather.humidity}% Hum</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{liveData.weather.wind_speed} km/h</span>
                </div>
              </div>
            )}

            {/* Action Buttons to Navigate */}
            {selectedPoint && (
              <div className="pt-2 flex items-center gap-2">
                {onNavigateToStreetView && (
                  <button
                    onClick={() =>
                      onNavigateToStreetView(
                        selectedPoint.latitude,
                        selectedPoint.longitude,
                        selectedPoint.name
                      )
                    }
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Explore Street View</span>
                  </button>
                )}
                {onNavigateToMap && (
                  <button
                    onClick={() => onNavigateToMap(selectedPoint.latitude, selectedPoint.longitude)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>2D GIS Map</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* AI Environmental Intelligence Brief */}
          {aiInsights && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>AI Atmospheric Advisor</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  Spike Risk: {aiInsights.spike_risk}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {aiInsights.executive_summary}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-cyan-900/40 text-[11px] text-slate-300">
                <div className="font-semibold text-cyan-300">Public Health Directives:</div>
                {aiInsights.citizen_precautions.slice(0, 3).map((prec, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{prec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 24-Hour Forecast Curve */}
          {liveData?.forecast_24h && liveData.forecast_24h.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">24-Hour Forecast Trajectory</span>
                <span className="text-[10px] text-slate-400 font-mono">Hourly CPCB</span>
              </div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={liveData.forecast_24h}>
                    <defs>
                      <linearGradient id="colorAqi3d" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      tickFormatter={(t) => (t ? t.slice(11, 16) : '')}
                      stroke="#475569"
                      tick={{ fontSize: 9, fill: '#94a3b8' }}
                    />
                    <YAxis
                      stroke="#475569"
                      tick={{ fontSize: 9, fill: '#94a3b8' }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted_aqi"
                      name="AQI"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAqi3d)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
