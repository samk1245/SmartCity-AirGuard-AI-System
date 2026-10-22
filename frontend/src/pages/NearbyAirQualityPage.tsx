import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  Radio,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  SlidersHorizontal,
  BarChart2
} from 'lucide-react';
import { api } from '../services/api';
import { NearbyStationItem, ReverseGeocodeResult } from '../types';

interface NearbyAirQualityPageProps {
  onNavigateToStreetView: (lat: number, lng: number, name: string) => void;
  onNavigateToMap: (lat: number, lng: number) => void;
  onSelectStationForForecast: (stationId: number) => void;
}

export const NearbyAirQualityPage: React.FC<NearbyAirQualityPageProps> = ({
  onNavigateToStreetView,
  onNavigateToMap,
  onSelectStationForForecast
}) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.2090 });
  const [locationName, setLocationName] = useState<string>('Delhi Central, India');
  const [radiusKm, setRadiusKm] = useState<number>(100);
  const [stations, setStations] = useState<NearbyStationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [gpsDetecting, setGpsDetecting] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const fetchNearby = async (lat: number, lng: number, rad: number) => {
    try {
      setLoading(true);
      const res = await api.getNearbyStations(lat, lng, rad, 15);
      setStations(res.stations);
    } catch (err) {
      console.error('Failed to fetch nearby stations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsDetecting(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setGpsDetecting(false);

        // Reverse geocode
        try {
          const rev = await api.reverseGeocode(latitude, longitude);
          setLocationName(rev.short_name || rev.city || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } catch {
          setLocationName(`${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`);
        }

        fetchNearby(latitude, longitude, radiusKm);
      },
      (err) => {
        setGpsDetecting(false);
        setGpsError(`GPS Access Denied (${err.message}). Defaulting to Delhi coordinates.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    fetchNearby(coords.lat, coords.lng, radiusKm);
  }, [radiusKm]);

  const getAqiColor = (aqi: number | null) => {
    if (!aqi) return '#64748b';
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#84cc16';
    if (aqi <= 200) return '#f59e0b';
    if (aqi <= 300) return '#f97316';
    if (aqi <= 400) return '#ef4444';
    return '#7f1d1d';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              Proximity Atmospheric Radar
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Nearby Air Quality & Station Distance Matrix
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Radial scan of verified continuous ambient air quality monitoring towers (CAAQMS) relative to your GPS coordinates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDetectGPS}
              disabled={gpsDetecting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-950/40"
            >
              <Navigation className={`w-4 h-4 ${gpsDetecting ? 'animate-spin' : ''}`} />
              {gpsDetecting ? 'Triangulating GPS...' : 'Use My GPS Location'}
            </button>
          </div>
        </div>

        {/* GPS Coordinates Bar & Radius Selector */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <span className="text-slate-400">Anchor Location: </span>
              <strong className="text-white">{locationName}</strong>{' '}
              <span className="text-slate-500">
                ({coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Radar Radius:</span>
            {[25, 50, 100, 250].map((r) => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  radiusKm === r
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {gpsError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}
      </div>

      {/* Stations List Table / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Stations Found Within {radiusKm} km Radius (<strong>{stations.length}</strong> active monitors)
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Official CPCB Standards
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-slate-900 rounded-xl animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : stations.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <Radio className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-300 text-sm font-semibold">No monitoring towers found within {radiusKm} km.</p>
            <p className="text-xs text-slate-500 mt-1">Try expanding the radar radius to 100 km or 250 km.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map((st) => (
              <div
                key={st.station_id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-sm group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition leading-snug">
                        {st.station_name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{st.city}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className="text-lg font-black px-2.5 py-1 rounded-xl block text-center"
                        style={{
                          backgroundColor: `${getAqiColor(st.aqi)}20`,
                          color: getAqiColor(st.aqi),
                          border: `1px solid ${getAqiColor(st.aqi)}40`
                        }}
                      >
                        {st.aqi !== null ? Math.round(st.aqi) : 'N/A'}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                        {st.category || 'Modeled'}
                      </span>
                    </div>
                  </div>

                  {/* Distance & Micro-stats */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Distance</span>
                      <span className="font-bold text-cyan-400">{st.distance_km} km</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">PM2.5</span>
                      <span className="font-bold text-slate-200">
                        {st.pm25 !== null ? `${st.pm25.toFixed(1)}` : 'N/A'}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">PM10</span>
                      <span className="font-bold text-slate-200">
                        {st.pm10 !== null ? `${st.pm10.toFixed(1)}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectStationForForecast(st.station_id)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    AI Forecast
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToMap(st.latitude, st.longitude)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="View on Map"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigateToStreetView(st.latitude, st.longitude, st.station_name)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Open Street View"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
