import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Wind,
  Thermometer,
  Droplets,
  Search,
  Sparkles,
  Maximize2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { StreetViewMetadata, LiveAtmosphericData, AIInsights, GeocodingResult } from '../types';

interface StreetViewPageProps {
  initialLat?: number;
  initialLng?: number;
  initialName?: string;
}

const PRESET_LOCATIONS = [
  { name: 'India Gate, New Delhi', city: 'Delhi', lat: 28.6129, lng: 77.2295 },
  { name: 'Hazratganj, Lucknow', city: 'Lucknow', lat: 26.8504, lng: 80.9499 },
  { name: 'Sangam, Prayagraj', city: 'Prayagraj', lat: 25.4262, lng: 81.8845 },
  { name: 'Marine Drive, Mumbai', city: 'Mumbai', lat: 18.9432, lng: 72.8230 },
  { name: 'Dashashwamedh Ghat, Varanasi', city: 'Varanasi', lat: 25.3076, lng: 83.0107 },
  { name: 'Times Square, New York', city: 'New York', lat: 40.7580, lng: -73.9855 },
  { name: 'Shibuya Crossing, Tokyo', city: 'Tokyo', lat: 35.6595, lng: 139.7005 },
];

export const StreetViewPage: React.FC<StreetViewPageProps> = ({
  initialLat = 28.6129,
  initialLng = 77.2295,
  initialName = 'India Gate, New Delhi',
}) => {
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [locationName, setLocationName] = useState<string>(initialName);

  const [metadata, setMetadata] = useState<StreetViewMetadata | null>(null);
  const [liveData, setLiveData] = useState<LiveAtmosphericData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sync if props change
  useEffect(() => {
    if (initialLat && initialLng) {
      setLat(initialLat);
      setLng(initialLng);
      if (initialName) setLocationName(initialName);
    }
  }, [initialLat, initialLng, initialName]);

  // Load Street View and atmospheric telemetry
  useEffect(() => {
    const loadStreetData = async () => {
      try {
        setLoading(true);
        const [meta, atm] = await Promise.all([
          api.getStreetViewMetadata(lat, lng, locationName),
          api.getLiveLocationAirQuality(lat, lng, locationName)
        ]);
        setMetadata(meta);
        setLiveData(atm);

        // Fetch AI health commentary
        const insights = await api.getAiInsights({
          locationName,
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
        console.error('Failed to load street view telemetry:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStreetData();
  }, [lat, lng, locationName]);

  // Geocoding search
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setIsSearching(true);
      try {
        const results = await api.searchLocations(q);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    setLat(preset.lat);
    setLng(preset.lng);
    setLocationName(preset.name);
  };

  const handleSelectSearchResult = (res: GeocodingResult) => {
    setLat(res.latitude);
    setLng(res.longitude);
    setLocationName(`${res.name}${res.country ? `, ${res.country}` : ''}`);
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Street View & Ground Pollution Explorer
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                Urban Panorama
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              Inspect real streetscapes, roadside pollution exposure, and localized pedestrian health risks.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-72 md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search address or street worldwide..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cyan-400 animate-pulse">
              ...
            </span>
          )}

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
              {searchResults.map((res) => (
                <button
                  key={res.id}
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-800/80 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-white">{res.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{res.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preset Landmarks Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <span className="text-xs text-slate-400 font-semibold whitespace-nowrap pl-1">Landmarks:</span>
        {PRESET_LOCATIONS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleSelectPreset(preset)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
              locationName === preset.name
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Street View Panorama + Live HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Street View Embed Viewport with Floating HUD */}
        <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl min-h-[540px]">
          {metadata ? (
            <iframe
              title="Street View Explorer"
              src={metadata.embed_url}
              className="w-full h-full min-h-[540px] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[540px] text-slate-500">
              Loading street view panorama...
            </div>
          )}

          {/* Floating Live Telemetry HUD Over Panorama */}
          {liveData && (
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2.5 max-w-sm pointer-events-none">
              {/* Glass AQI Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 shadow-2xl text-white space-y-2 pointer-events-auto">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Ground Telemetry
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${liveData.air_quality.category === 'Good' ? '#065f46' : liveData.air_quality.category === 'Satisfactory' ? '#3f6212' : liveData.air_quality.category === 'Moderate' ? '#854d0e' : liveData.air_quality.category === 'Poor' ? '#9a3412' : '#991b1b'}90`,
                      color: liveData.air_quality.category === 'Good' ? '#34d399' : liveData.air_quality.category === 'Satisfactory' ? '#a3e635' : liveData.air_quality.category === 'Moderate' ? '#fde047' : liveData.air_quality.category === 'Poor' ? '#fb923c' : '#f87171',
                    }}
                  >
                    {liveData.air_quality.category}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="text-3xl font-black text-white">{liveData.air_quality.aqi}</div>
                    <div className="text-[10px] text-slate-400">CPCB NAQI Index</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-bold text-slate-200">
                      PM2.5: {liveData.air_quality.pm25 ?? '--'} µg/m³
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      PM10: {liveData.air_quality.pm10 ?? '--'} µg/m³
                    </div>
                  </div>
                </div>
              </div>

              {/* Citizen Mask Warning Banner */}
              {liveData.air_quality.aqi > 150 && (
                <div className="p-3 rounded-xl bg-rose-950/90 backdrop-blur-md border border-rose-600/60 text-white shadow-xl flex items-center gap-2.5 pointer-events-auto">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold text-rose-200 block">High Particulate Hazard</span>
                    <span>Wear certified N95 respirator mask on this street.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Controls Bar inside Viewport */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
            {metadata && (
              <a
                href={metadata.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-700 hover:border-cyan-500 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 shadow-xl transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open in Google Maps 360°</span>
                <ExternalLink className="w-3 h-3 text-cyan-400 ml-0.5" />
              </a>
            )}
          </div>
        </div>

        {/* Right Information & Health Directives */}
        <div className="lg:col-span-4 space-y-4">
          {/* Location Coordinates Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Inspection Target</span>
            </div>
            <h3 className="text-lg font-black text-white">{locationName}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">LATITUDE</span>
                <span>{lat.toFixed(5)}° N</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">LONGITUDE</span>
                <span>{lng.toFixed(5)}° E</span>
              </div>
            </div>

            {/* Weather Factors */}
            {liveData && (
              <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-800/40">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                  <span className="font-bold text-white">{liveData.weather.temperature}°C</span>
                  <span className="block text-[9px] text-slate-500">Temp</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/40">
                  <Droplets className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                  <span className="font-bold text-white">{liveData.weather.humidity}%</span>
                  <span className="block text-[9px] text-slate-500">Humidity</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/40">
                  <Wind className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                  <span className="font-bold text-white">{liveData.weather.wind_speed}</span>
                  <span className="block text-[9px] text-slate-500">km/h Wind</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Ground Insights */}
          {aiInsights && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/30 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Pedestrian Environmental Impact</span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {aiInsights.pollutant_assessment}
              </p>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-900/50 text-[11px] text-slate-300 space-y-1.5">
                <div className="font-semibold text-cyan-300">Pedestrian Advisory:</div>
                {aiInsights.citizen_precautions.map((prec, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{prec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Street View Integration Note */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1 leading-relaxed">
            <span className="font-bold text-slate-300 block">Integration Architecture</span>
            <p>
              SmartCity AirGuard AI links live satellite and atmospheric modeling from Open-Meteo with 360° panoramic spatial coordinates. Add your <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">GOOGLE_MAPS_API_KEY</code> in Settings to unlock custom interactive panoramic movement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
