import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Info, Thermometer, Wind, RefreshCw } from 'lucide-react';
import { StationMapItem, City } from '../types';
import { api } from '../services/api';
import { AQIBadge, getCategoryStyles } from '../components/AQIBadge';

interface MapPageProps {
  cities: City[];
  selectedCity: string;
  onSelectStationForForecast: (stationId: number) => void;
}

// Helper component to center map when selected city changes
const MapCenterController: React.FC<{ center: [number, number]; zoom: number }> = ({
  center,
  zoom
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

// Create custom glowing circular markers with AQI number
const createCustomMarker = (aqi: number, category: string) => {
  const colorMap: Record<string, string> = {
    Good: '#10b981',
    Satisfactory: '#84cc16',
    Moderate: '#f59e0b',
    Poor: '#f97316',
    'Very Poor': '#ef4444',
    Severe: '#7f1d1d'
  };
  const color = colorMap[category] || '#06b6d4';

  const html = `
    <div style="
      background-color: ${color};
      color: #ffffff;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 11px;
      box-shadow: 0 0 12px ${color}88, 0 2px 6px rgba(0,0,0,0.6);
      border: 2px solid #ffffff;
    ">
      ${Math.round(aqi)}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-aqi-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
};

export const MapPage: React.FC<MapPageProps> = ({
  cities,
  selectedCity,
  onSelectStationForForecast
}) => {
  const [stations, setStations] = useState<StationMapItem[]>([]);
  const [cityCenters, setCityCenters] = useState<Record<string, { lat: number; lng: number }>>({});
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<StationMapItem | null>(null);

  const cityCoordinates: Record<string, [number, number]> = {
    Delhi: [28.6139, 77.209],
    Lucknow: [26.8467, 80.9462],
    Prayagraj: [25.4358, 81.8463],
    Kanpur: [26.4499, 80.3319],
    Varanasi: [25.3176, 82.9739],
    All: [26.8467, 80.9462] // Center around Uttar Pradesh / Northern India
  };

  const currentCenter = cityCoordinates[selectedCity] || [26.8467, 80.9462];
  const zoomLevel = selectedCity === 'All' ? 7 : 12;

  const loadMapData = async () => {
    try {
      setLoading(true);
      const data = await api.getMapStations(selectedCity !== 'All' ? selectedCity : undefined);
      setStations(data.stations);
      setCityCenters(data.city_centers);
      if (data.stations.length > 0) {
        setSelectedStation(data.stations[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapData();
  }, [selectedCity]);

  return (
    <div className="space-y-4">
      {/* Map header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            Location-Based Pollution Geospatial Map
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            OpenStreetMap live station coordinates colored by CPCB NAQI severity
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] bg-slate-800/90 border border-slate-700/60 rounded-xl px-3 py-1.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Good
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500" /> Satisfactory
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Poor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Very Poor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-900" /> Severe
          </span>
        </div>
      </div>

      {/* Main Map + Station Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
        {/* Leaflet Map Container */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl relative">
          {loading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-20 flex items-center justify-center text-cyan-400 text-xs font-semibold gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading station coordinates...
            </div>
          )}

          <MapContainer
            center={currentCenter}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', background: '#0f172a' }}
          >
            <MapCenterController center={currentCenter} zoom={zoomLevel} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {stations.map((st) => (
              <Marker
                key={st.id}
                position={[st.latitude, st.longitude]}
                icon={createCustomMarker(st.latest_aqi, st.category)}
                eventHandlers={{
                  click: () => setSelectedStation(st)
                }}
              >
                <Popup className="aqi-popup">
                  <div className="p-2 text-slate-900 min-w-[180px]">
                    <div className="font-bold text-sm">{st.name}</div>
                    <div className="text-xs text-slate-500 mb-2">{st.city}</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">AQI: {Math.round(st.latest_aqi)}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200">
                        {st.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5 border-t pt-1">
                      <div>PM2.5: {st.pm25 || '—'} µg/m³</div>
                      <div>PM10: {st.pm10 || '—'} µg/m³</div>
                      <div>NO2: {st.no2 || '—'} µg/m³</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Selected Station Inspection Sidebar */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-xl flex flex-col justify-between overflow-y-auto">
          {selectedStation ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Inspecting Station
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedStation.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedStation.city} • Code: {selectedStation.code}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Latest AQI</div>
                  <div className="text-3xl font-extrabold text-white">
                    {Math.round(selectedStation.latest_aqi)}
                  </div>
                </div>
                <AQIBadge
                  category={selectedStation.category}
                  aqi={selectedStation.latest_aqi}
                  size="md"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-semibold uppercase text-[10px]">
                  Pollutant Concentrations
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">PM2.5</span>
                    <div className="font-bold text-slate-200 text-sm">
                      {selectedStation.pm25 ?? '—'} µg/m³
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">PM10</span>
                    <div className="font-bold text-slate-200 text-sm">
                      {selectedStation.pm10 ?? '—'} µg/m³
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">NO2</span>
                    <div className="font-bold text-slate-200 text-sm">
                      {selectedStation.no2 ?? '—'} µg/m³
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Dominant</span>
                    <div className="font-bold text-cyan-400 text-sm uppercase">
                      {selectedStation.dominant_pollutant}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-700">
                Coordinates: {selectedStation.latitude.toFixed(4)}°N, {selectedStation.longitude.toFixed(4)}°E
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Click any station pin on the map to inspect live parameters.
            </div>
          )}

          {selectedStation && (
            <button
              onClick={() => onSelectStationForForecast(selectedStation.id)}
              className="w-full mt-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              Run AI Forecast for this Station
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
