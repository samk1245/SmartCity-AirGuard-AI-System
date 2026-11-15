import React, { useState, useEffect, useCallback } from 'react';
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
  RotateCcw,
  Crosshair,
  Navigation,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { StreetViewMetadata, LiveAtmosphericData, AIInsights, GeocodingResult, ReverseGeocodeResult } from '../types';

interface StreetViewPageProps {
  initialLat?: number;
  initialLng?: number;
  initialName?: string;
  autoLocate?: boolean;
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
  autoLocate = false,
}) => {
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [locationName, setLocationName] = useState<string>(initialName);
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);

  const [metadata, setMetadata] = useState<StreetViewMetadata | null>(null);
  const [liveData, setLiveData] = useState<LiveAtmosphericData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

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

  // Core function: Locate user and switch to current location Street View
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        setIsCurrentLocation(true);

        try {
          // Reverse-geocode to get precise street and neighbourhood
          const rev = await api.reverseGeocode(latitude, longitude);
          const detectedTitle = rev.short_name || `${rev.city}${rev.country ? `, ${rev.country}` : ''}`;
          setLocationName(detectedTitle || 'My Current Location');
        } catch (err) {
          console.warn('Reverse geocode fallback:', err);
          setLocationName(`Current Location (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('GPS Location permission was denied. Please allow location access in your browser settings to view your street.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGeoError('GPS position is currently unavailable on your device.');
        } else {
          setGeoError(`Location detection timed out: ${err.message}`);
        }
      },
      { timeout: 12000, enableHighAccuracy: true, maximumAge: 30000 }
    );
  }, []);

  // Auto locate if requested
  useEffect(() => {
    if (autoLocate) {
      handleUseCurrentLocation();
    }
  }, [autoLocate, handleUseCurrentLocation]);

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
    setIsCurrentLocation(false);
    setLat(preset.lat);
    setLng(preset.lng);
    setLocationName(preset.name);
    setGeoError(null);
  };

  const handleSelectSearchResult = (res: GeocodingResult) => {
    setIsCurrentLocation(false);
    setLat(res.latitude);
    setLng(res.longitude);
    setLocationName(`${res.name}${res.country ? `, ${res.country}` : ''}`);
    setSearchResults([]);
    setSearchQuery('');
    setGeoError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-glow-emerald/10">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Street View & Ground Pollution Explorer
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-900 text-emerald-300 border border-emerald-500/30 shadow-glow-emerald/20">
                Urban Panorama
              </span>
            </h1>
            <p className="text-sm text-forest-200">
              Inspect real streetscapes, roadside pollution exposure, and localized pedestrian health risks.
            </p>
          </div>
        </div>

        {/* Action Controls: Live GPS Button + Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary View Current Location Button */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
              isCurrentLocation
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30 border border-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 border border-cyan-400'
            }`}
            title="Detect GPS coordinates and open street view of your current location"
          >
            {isLocating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Acquiring Live GPS...</span>
              </>
            ) : isCurrentLocation ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Viewing My Location</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4 text-slate-950" />
                <span>View My Current Location</span>
              </>
            )}
          </button>

          {/* Search Bar */}
          <div className="relative w-64 md:w-80 font-mono">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search address or street worldwide..."
              className="w-full bg-forest-900 border border-emerald-500/25 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
            />
            {isSearching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-mint-400 animate-pulse">
                ...
              </span>
            )}

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-forest-950 border border-emerald-500/30 rounded-xl shadow-spatial-glass z-50 overflow-hidden divide-y divide-emerald-900/50 backdrop-blur-xl">
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-forest-900/80 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-white">{res.name}</span>
                    <span className="text-[10px] text-mint-300 font-mono">{res.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Geolocation Feedback / Error Message */}
      {geoError && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{geoError}</span>
          </div>
          <button
            onClick={() => setGeoError(null)}
            className="text-[11px] underline text-amber-400 hover:text-amber-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Location Active Banner */}
      {isCurrentLocation && (
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white">Live Street View Active:</span>
            <span>{locationName}</span>
            <span className="text-emerald-400/80 font-mono text-[11px]">
              ({lat.toFixed(5)}° N, {lng.toFixed(5)}° E)
            </span>
          </div>
          <button
            onClick={handleUseCurrentLocation}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-[11px] font-bold border border-emerald-500/40 flex items-center gap-1 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Re-scan GPS</span>
          </button>
        </div>
      )}

      {/* Preset Landmarks Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <span className="text-xs text-slate-400 font-semibold whitespace-nowrap pl-1">Popular Spots:</span>
        {PRESET_LOCATIONS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleSelectPreset(preset)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
              !isCurrentLocation && locationName === preset.name
                ? 'bg-emerald-500 text-forest-950 font-bold border-emerald-400 shadow-glow-emerald'
                : 'bg-forest-950/80 hover:bg-forest-900 text-slate-300 border-emerald-900/40'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Street View Panorama + Live HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Street View Embed Viewport with Floating HUD */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-forest-950 border border-emerald-500/25 shadow-spatial-glass min-h-[560px]">
          {metadata ? (
            <iframe
              key={`${lat}_${lng}`}
              title="Street View Explorer"
              src={metadata.embed_url}
              className="w-full h-full min-h-[560px] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[560px] text-slate-400 font-mono">
              Loading street view panorama...
            </div>
          )}

          {/* Floating Live Telemetry HUD Over Panorama */}
          {liveData && (
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2.5 max-w-sm pointer-events-none font-mono">
              {/* Glass AQI Badge */}
              <div className="p-3.5 rounded-2xl bg-forest-950/90 backdrop-blur-xl border border-emerald-500/30 shadow-glass text-white space-y-2 pointer-events-auto">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-mint-300 uppercase tracking-wider">
                      {isCurrentLocation ? 'My Street Telemetry' : 'Ground Telemetry'}
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

          {/* Bottom Right In-Viewport Action Controls */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
            {/* Direct GPS Recenter Button inside Viewport */}
            {!isCurrentLocation && (
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="px-3.5 py-2 rounded-xl bg-forest-950/85 backdrop-blur-xl border border-emerald-500/50 hover:bg-emerald-500/20 text-mint-300 text-xs font-semibold flex items-center gap-1.5 shadow-xl transition-all"
              >
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span>Jump to My Street</span>
              </button>
            )}

            {metadata && (
              <a
                href={metadata.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-forest-950/85 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-400 text-mint-300 text-xs font-semibold flex items-center gap-1.5 shadow-xl transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open in Google Maps 360°</span>
                <ExternalLink className="w-3 h-3 text-mint-400 ml-0.5" />
              </a>
            )}
          </div>
        </div>

        {/* Right Information & Health Directives */}
        <div className="lg:col-span-4 space-y-4">
          {/* Location Coordinates Card */}
          <div className="p-5 rounded-2xl glass-card border border-emerald-500/25 shadow-glass space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-mint-400 text-xs font-bold uppercase tracking-wider font-mono">
                <MapPin className="w-4 h-4" />
                <span>{isCurrentLocation ? 'My Current Location' : 'Inspection Target'}</span>
              </div>
              {isCurrentLocation && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-bold font-mono">
                  GPS Active
                </span>
              )}
            </div>

            <h3 className="text-lg font-black text-white leading-snug">{locationName}</h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 bg-forest-950/80 p-2.5 rounded-xl border border-emerald-900/40">
              <div>
                <span className="text-slate-400 block text-[10px]">LATITUDE</span>
                <span>{lat.toFixed(5)}° N</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">LONGITUDE</span>
                <span>{lng.toFixed(5)}° E</span>
              </div>
            </div>

            {/* Weather Factors */}
            {liveData && (
              <div className="pt-2 border-t border-emerald-900/40 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-forest-950/60 border border-emerald-900/30">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                  <span className="font-bold text-white">{liveData.weather.temperature}°C</span>
                  <span className="block text-[9px] text-slate-400">Temp</span>
                </div>
                <div className="p-2 rounded-lg bg-forest-950/60 border border-emerald-900/30">
                  <Droplets className="w-3.5 h-3.5 text-mint-400 mx-auto mb-1" />
                  <span className="font-bold text-white">{liveData.weather.humidity}%</span>
                  <span className="block text-[9px] text-slate-400">Humidity</span>
                </div>
                <div className="p-2 rounded-lg bg-forest-950/60 border border-emerald-900/30">
                  <Wind className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                  <span className="font-bold text-white">{liveData.weather.wind_speed}</span>
                  <span className="block text-[9px] text-slate-400">km/h Wind</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Ground Insights */}
          {aiInsights && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-forest-950 to-emerald-950/40 border border-emerald-500/30 shadow-glass space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-mint-300 uppercase tracking-wider font-mono">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Pedestrian Atmospheric Advisory</span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {aiInsights.pollutant_assessment}
              </p>

              <div className="p-3 rounded-xl bg-forest-950/80 border border-emerald-900/50 text-[11px] text-slate-300 space-y-1.5">
                <div className="font-semibold text-mint-300">Pedestrian Advisory:</div>
                {aiInsights.citizen_precautions.map((prec, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{prec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions Card */}
          <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 space-y-2 text-xs">
            <span className="font-bold text-white block text-xs">GPS Street Teleportation</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              AirGuard AI connects your browser's physical location with Google Street View panoramas and Open-Meteo atmospheric sensors to give you real-time micro-climate visibility on the street where you stand.
            </p>
            {!isCurrentLocation && (
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="w-full py-2 px-3 rounded-xl btn-cinematic-emerald font-bold text-xs flex items-center justify-center gap-1.5 transition-all mt-1"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Switch to My Live Street Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
