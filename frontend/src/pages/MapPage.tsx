import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Compass,
  Layers,
  Crosshair,
  Thermometer,
  Wind,
  Droplets,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { StationMapItem, City, LiveAtmosphericData } from '../types';
import { api } from '../services/api';
import { AQIBadge } from '../components/AQIBadge';

interface MapPageProps {
  cities: City[];
  selectedCity: string;
  onSelectStationForForecast: (stationId: number) => void;
  onNavigateToStreetView?: (lat: number, lng: number, name: string) => void;
}

// Map center transition controller
const MapCenterController: React.FC<{ center: [number, number]; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

// Map click listener component to allow pinpointing any spot on Earth
const MapClickListener: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({
  onMapClick,
}) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Custom glowing circular markers with AQI number
const createCustomMarker = (aqi: number, category: string) => {
  const colorMap: Record<string, string> = {
    Good: '#10b981',
    Satisfactory: '#84cc16',
    Moderate: '#f59e0b',
    Poor: '#f97316',
    'Very Poor': '#ef4444',
    Severe: '#7f1d1d',
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
      box-shadow: 0 0 14px ${color}aa, 0 2px 6px rgba(0,0,0,0.6);
      border: 2px solid #ffffff;
      cursor: pointer;
    ">
      ${Math.round(aqi)}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-aqi-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

const createPinMarker = () => {
  const html = `
    <div style="
      background-color: #06b6d4;
      color: #0f172a;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px #06b6d4, 0 2px 8px rgba(0,0,0,0.8);
      border: 2px solid #ffffff;
    ">
      <div style="transform: rotate(45deg); font-weight: 900; font-size: 12px;">★</div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pin-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

export const MapPage: React.FC<MapPageProps> = ({
  cities,
  selectedCity,
  onSelectStationForForecast,
  onNavigateToStreetView,
}) => {
  const [stations, setStations] = useState<StationMapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<StationMapItem | null>(null);

  // Custom clicked coordinate point
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [clickedAtmosphere, setClickedAtmosphere] = useState<LiveAtmosphericData | null>(null);
  const [loadingClicked, setLoadingClicked] = useState(false);

  // Map Tile Style layers
  const [tileLayer, setTileLayer] = useState<'dark' | 'satellite' | 'streets'>('dark');

  const tileUrls = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{z}',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  const cityCoordinates: Record<string, [number, number]> = {
    Delhi: [28.6139, 77.209],
    Lucknow: [26.8467, 80.9462],
    Prayagraj: [25.4358, 81.8463],
    Kanpur: [26.4499, 80.3319],
    Varanasi: [25.3176, 82.9739],
    Mumbai: [19.076, 72.8777],
    Bengaluru: [12.9716, 77.5946],
    Kolkata: [22.5726, 88.3639],
    Hyderabad: [17.385, 78.4867],
    Ahmedabad: [23.0225, 72.5714],
    Jaipur: [26.9124, 75.7873],
    Patna: [25.5941, 85.1376],
    Agra: [27.1767, 78.0081],
    Pune: [18.5204, 73.8567],
    Chandigarh: [30.7333, 76.7794],
    All: [22.5937, 78.9629],
  };

  const [currentCenter, setCurrentCenter] = useState<[number, number]>(
    cityCoordinates[selectedCity] || [22.5937, 78.9629]
  );
  const [zoomLevel, setZoomLevel] = useState<number>(selectedCity === 'All' ? 5 : 12);

  useEffect(() => {
    setCurrentCenter(cityCoordinates[selectedCity] || [22.5937, 78.9629]);
    setZoomLevel(selectedCity === 'All' ? 5 : 12);
  }, [selectedCity]);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const data = await api.getMapStations(selectedCity !== 'All' ? selectedCity : undefined);
      setStations(data.stations);
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

  // Click on any map coordinate to fetch real-time atmospheric data
  const handleMapClick = async (lat: number, lng: number) => {
    setClickedCoord({ lat, lng });
    setSelectedStation(null);
    try {
      setLoadingClicked(true);
      const atm = await api.getLiveLocationAirQuality(lat, lng, 'Pinned Map Coordinate');
      setClickedAtmosphere(atm);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingClicked(false);
    }
  };

  // User GPS locate me
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCurrentCenter([latitude, longitude]);
      setZoomLevel(13);
      handleMapClick(latitude, longitude);
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            Interactive 2D/GIS Pollution Map
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Station & Coordinate Radar
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Click any station or tap any coordinate worldwide to query real-time atmospheric measurements.
          </p>
        </div>

        {/* Layer Switcher & Tools */}
        <div className="flex items-center gap-2.5">
          {/* Layer Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => setTileLayer('dark')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                tileLayer === 'dark' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark Matter
            </button>
            <button
              onClick={() => setTileLayer('streets')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                tileLayer === 'streets' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Streets
            </button>
          </div>

          {/* GPS Button */}
          <button
            onClick={handleLocateMe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-md transition-all active:scale-95"
            title="Locate my position on map"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>Locate Me</span>
          </button>
        </div>
      </div>

      {/* Main Map + Station Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[620px]">
        {/* Leaflet Map Container */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
          {loading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-20 flex items-center justify-center text-cyan-400 text-xs font-semibold gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading station coordinates...
            </div>
          )}

          <MapContainer
            center={currentCenter}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', background: '#020817' }}
          >
            <MapCenterController center={currentCenter} zoom={zoomLevel} />
            <MapClickListener onMapClick={handleMapClick} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={tileUrls[tileLayer]}
            />

            {/* Indian Monitoring Stations */}
            {stations.map((st) => (
              <Marker
                key={st.id}
                position={[st.latitude, st.longitude]}
                icon={createCustomMarker(st.latest_aqi, st.category)}
                eventHandlers={{
                  click: () => {
                    setSelectedStation(st);
                    setClickedCoord(null);
                    setClickedAtmosphere(null);
                  },
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

            {/* Custom User Pinned Coordinate Marker */}
            {clickedCoord && (
              <Marker position={[clickedCoord.lat, clickedCoord.lng]} icon={createPinMarker()}>
                <Popup>
                  <div className="p-1 text-slate-900 text-xs font-bold">
                    Pinned Coordinates: {clickedCoord.lat.toFixed(4)}, {clickedCoord.lng.toFixed(4)}
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Quick Info Chip */}
          <div className="absolute bottom-4 left-4 z-[400] px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur border border-slate-700 text-[11px] text-slate-300 font-medium pointer-events-none hidden sm:block">
            Tip: Click anywhere on the map surface to drop a pin and inspect live atmospheric parameters.
          </div>
        </div>

        {/* Selected Station / Coordinate Drawer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between overflow-y-auto">
          {/* If an established station is selected */}
          {selectedStation && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Inspecting Station
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedStation.name}</h3>
                <p className="text-xs text-slate-400">
                  {selectedStation.city} • Code: {selectedStation.code}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
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
                  <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px]">PM2.5</span>
                    <div className="font-bold text-slate-200 text-sm">
                      {selectedStation.pm25 ?? '—'} µg/m³
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px]">PM10</span>
                    <div className="font-bold text-slate-200 text-sm">
                      {selectedStation.pm10 ?? '—'} µg/m³
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px]">NO2</span>
                    <div className="font-bold text-slate-200 text-sm">
                      {selectedStation.no2 ?? '—'} µg/m³
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px]">Dominant</span>
                    <div className="font-bold text-cyan-400 text-sm uppercase">
                      {selectedStation.dominant_pollutant}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Coordinates: {selectedStation.latitude.toFixed(4)}°N, {selectedStation.longitude.toFixed(4)}°E
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onSelectStationForForecast(selectedStation.id)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run AI Forecast for this Station</span>
                </button>

                {onNavigateToStreetView && (
                  <button
                    onClick={() =>
                      onNavigateToStreetView(
                        selectedStation.latitude,
                        selectedStation.longitude,
                        `${selectedStation.name}, ${selectedStation.city}`
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View in 360° Street View</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* If a custom pinned coordinate is selected */}
          {clickedCoord && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Custom Pinned Location
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {clickedAtmosphere?.location.city || 'Custom Coordinate'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {clickedCoord.lat.toFixed(4)}°N, {clickedCoord.lng.toFixed(4)}°E
                </p>
              </div>

              {loadingClicked ? (
                <div className="py-8 text-center text-xs text-slate-400 animate-pulse flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Fetching atmospheric telemetry...</span>
                </div>
              ) : clickedAtmosphere ? (
                <>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Calculated CPCB AQI</div>
                      <div className="text-3xl font-extrabold text-white">
                        {clickedAtmosphere.air_quality.aqi}
                      </div>
                    </div>
                    <AQIBadge
                      category={clickedAtmosphere.air_quality.category}
                      aqi={clickedAtmosphere.air_quality.aqi}
                      size="md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 text-[10px]">PM2.5</span>
                      <div className="font-bold text-slate-200">
                        {clickedAtmosphere.air_quality.pm25 ?? '—'} µg/m³
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 text-[10px]">PM10</span>
                      <div className="font-bold text-slate-200">
                        {clickedAtmosphere.air_quality.pm10 ?? '—'} µg/m³
                      </div>
                    </div>
                  </div>

                  {onNavigateToStreetView && (
                    <button
                      onClick={() =>
                        onNavigateToStreetView(
                          clickedCoord.lat,
                          clickedCoord.lng,
                          clickedAtmosphere.location.city
                        )
                      }
                      className="w-full mt-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Explore Street View for this Pin</span>
                    </button>
                  )}
                </>
              ) : null}
            </div>
          )}

          {!selectedStation && !clickedCoord && (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <MapPin className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Click any monitoring station pin or tap the map surface to inspect real-time air quality.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
