import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvents } from 'react-leaflet';
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
  ExternalLink,
  Flame,
  Search,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  TreePine,
  Car,
  Factory
} from 'lucide-react';
import { StationMapItem, City, LiveAtmosphericData } from '../types';
import { api } from '../services/api';
import { AQIBadge } from '../components/AQIBadge';
import { playCyberClick } from '../utils/audioSystem';

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

// Map click listener component
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

// Exact requested AQI marker colors:
// Green: Good, Yellow: Moderate, Orange: Unhealthy for sensitive, Red: Unhealthy, Purple: Very Unhealthy, Maroon: Hazardous
const getMarkerColor = (aqi: number) => {
  if (aqi <= 50) return '#00E6A0'; // Emerald Green
  if (aqi <= 100) return '#84CC16'; // Lime/Yellow
  if (aqi <= 200) return '#FF9F43'; // Orange (Unhealthy for sensitive)
  if (aqi <= 300) return '#F97316'; // Red-Orange (Unhealthy)
  if (aqi <= 400) return '#FF4560'; // Purple/Crimson (Very unhealthy)
  return '#991B1B'; // Maroon (Hazardous)
};

const createCustomMarker = (aqi: number) => {
  const color = getMarkerColor(aqi);

  const html = `
    <div style="
      background-color: ${color};
      color: #07111F;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 11px;
      box-shadow: 0 0 18px ${color}cc, 0 4px 10px rgba(0,0,0,0.8);
      border: 2px solid #ffffff;
      cursor: pointer;
      transition: transform 0.2s ease;
    ">
      ${Math.round(aqi)}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-aqi-marker',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22],
  });
};

const createPinMarker = () => {
  const html = `
    <div style="
      background-color: #00D9FF;
      color: #07111F;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px #00D9FF, 0 2px 8px rgba(0,0,0,0.8);
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
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStation, setSelectedStation] = useState<StationMapItem | null>(null);

  // Clicked coordinate
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [clickedAtmosphere, setClickedAtmosphere] = useState<LiveAtmosphericData | null>(null);
  const [loadingClicked, setLoadingClicked] = useState<boolean>(false);

  // Base map style: dark, satellite, streets
  const [tileLayer, setTileLayer] = useState<'dark' | 'satellite' | 'streets'>('dark');

  // Multi-layer layer toggles:
  // 1. Live Stations
  // 2. Pollution Heatmap
  // 3. Traffic Density Corridors
  // 4. Industrial Pollution Zones
  // 5. Green Zones & Parks
  // 6. Geographic Hotspots
  const [layerHeatmap, setLayerHeatmap] = useState<boolean>(true);
  const [layerTraffic, setLayerTraffic] = useState<boolean>(true);
  const [layerIndustrial, setLayerIndustrial] = useState<boolean>(true);
  const [layerGreen, setLayerGreen] = useState<boolean>(true);
  const [layerHotspots, setLayerHotspots] = useState<boolean>(true);

  // Map search query
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Click on coordinate
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

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCurrentCenter([latitude, longitude]);
      setZoomLevel(13);
      handleMapClick(latitude, longitude);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const matchCity = cities.find((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (matchCity) {
      setCurrentCenter([matchCity.latitude, matchCity.longitude]);
      setZoomLevel(12);
      return;
    }
    const matchStation = stations.find((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (matchStation) {
      setCurrentCenter([matchStation.latitude, matchStation.longitude]);
      setZoomLevel(14);
      setSelectedStation(matchStation);
    }
  };

  // Geographic reference layers (Delhi & National hubs sample corridors)
  const trafficCorridors: [number, number][][] = [
    // Outer Ring Road corridor
    [[28.7041, 77.1025], [28.6500, 77.1400], [28.5800, 77.2200], [28.5500, 77.2600]],
    // NH-44 Grand Trunk road
    [[28.7500, 77.1300], [28.6800, 77.1800], [28.6139, 77.2090]],
  ];

  const industrialZones: { name: string; center: [number, number]; radius: number }[] = [
    { name: 'Okhla Industrial Cluster', center: [28.5300, 77.2750], radius: 2500 },
    { name: 'Mayapuri Industrial Area', center: [28.6300, 77.1250], radius: 2000 },
    { name: 'Wazirpur Industrial Area', center: [28.6950, 77.1650], radius: 2200 },
  ];

  const greenZones: { name: string; center: [number, number]; radius: number }[] = [
    { name: 'Delhi Southern Ridge Sanctuary', center: [28.5150, 77.1700], radius: 3000 },
    { name: 'Central Forest & Lodhi Green Belt', center: [28.5900, 77.2180], radius: 1800 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive 3D Smart City GIS Map</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Geospatial Environmental Intelligence Map
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Live CAAQMS towers, pollution heatmaps, vehicular traffic corridors, industrial zones, and urban green sanctuaries.
          </p>
        </div>

        {/* Search Bar + GPS */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station or city..."
              className="glass-input pl-8 pr-3 py-1.5 rounded-xl text-xs w-48 sm:w-56 text-white focus:outline-none"
            />
          </form>

          <button
            onClick={handleLocateMe}
            className="btn-cinematic-cyan px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-glow-cyan"
            title="Locate my position via GPS"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Locate Me</span>
          </button>
        </div>
      </div>

      {/* Layer Toggles Strip */}
      <div className="p-3 rounded-2xl glass-card border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Map Layers:</span>

          <button
            onClick={() => setLayerHeatmap(!layerHeatmap)}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              layerHeatmap ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'bg-slate-800 text-slate-500'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Pollution Heatmap</span>
          </button>

          <button
            onClick={() => setLayerTraffic(!layerTraffic)}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              layerTraffic ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-500'
            }`}
          >
            <Car className="w-3 h-3" />
            <span>Traffic Corridors</span>
          </button>

          <button
            onClick={() => setLayerIndustrial(!layerIndustrial)}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              layerIndustrial ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-500'
            }`}
          >
            <Factory className="w-3 h-3" />
            <span>Industrial Zones</span>
          </button>

          <button
            onClick={() => setLayerGreen(!layerGreen)}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              layerGreen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
            }`}
          >
            <TreePine className="w-3 h-3" />
            <span>Green Sanctuaries</span>
          </button>
        </div>

        {/* Base Map Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs">
          <button
            onClick={() => setTileLayer('dark')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              tileLayer === 'dark' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Midnight
          </button>
          <button
            onClick={() => setTileLayer('satellite')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              tileLayer === 'satellite' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
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
      </div>

      {/* Main Map + Station Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[650px]">
        {/* Leaflet Map Viewport */}
        <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
          {loading && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-20 flex items-center justify-center text-cyan-400 text-xs font-semibold gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Calibrating GIS station coordinates...</span>
            </div>
          )}

          <MapContainer
            center={currentCenter}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', background: '#07111F' }}
          >
            <MapCenterController center={currentCenter} zoom={zoomLevel} />
            <MapClickListener onMapClick={handleMapClick} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={tileUrls[tileLayer]}
            />

            {/* Simulated Heatmap Diffusion Circles around active stations */}
            {layerHeatmap &&
              stations.map((st) => (
                <Circle
                  key={`heat-${st.id}`}
                  center={[st.latitude, st.longitude]}
                  radius={st.latest_aqi > 250 ? 6000 : 3500}
                  pathOptions={{
                    color: getMarkerColor(st.latest_aqi),
                    fillColor: getMarkerColor(st.latest_aqi),
                    fillOpacity: st.latest_aqi > 250 ? 0.28 : 0.18,
                    stroke: false,
                  }}
                />
              ))}

            {/* Traffic Corridors Layer */}
            {layerTraffic &&
              trafficCorridors.map((line, idx) => (
                <Polyline
                  key={`traffic-${idx}`}
                  positions={line}
                  pathOptions={{ color: '#00D9FF', weight: 4, opacity: 0.65, dashArray: '6, 6' }}
                />
              ))}

            {/* Industrial Zones Layer */}
            {layerIndustrial &&
              industrialZones.map((ind) => (
                <Circle
                  key={ind.name}
                  center={ind.center}
                  radius={ind.radius}
                  pathOptions={{ color: '#FF4560', fillColor: '#FF4560', fillOpacity: 0.22, weight: 1.5 }}
                />
              ))}

            {/* Green Sanctuaries Layer */}
            {layerGreen &&
              greenZones.map((gz) => (
                <Circle
                  key={gz.name}
                  center={gz.center}
                  radius={gz.radius}
                  pathOptions={{ color: '#00E6A0', fillColor: '#00E6A0', fillOpacity: 0.25, weight: 1.5 }}
                />
              ))}

            {/* Indian Monitoring Stations Markers */}
            {stations.map((st) => (
              <Marker
                key={st.id}
                position={[st.latitude, st.longitude]}
                icon={createCustomMarker(st.latest_aqi)}
                eventHandlers={{
                  click: () => {
                    setSelectedStation(st);
                    setClickedCoord(null);
                    setClickedAtmosphere(null);
                  },
                }}
              >
                <Popup className="aqi-popup">
                  <div className="p-2 text-slate-900 min-w-[190px]">
                    <div className="font-extrabold text-sm">{st.name}</div>
                    <div className="text-xs text-slate-600 mb-1">{st.city}</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">AQI: {Math.round(st.latest_aqi)}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200">
                        {st.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700 space-y-0.5 border-t pt-1 font-mono">
                      <div>PM2.5: {st.pm25 || '—'} µg/m³</div>
                      <div>PM10: {st.pm10 || '—'} µg/m³</div>
                      <div>NO2: {st.no2 || '—'} µg/m³</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Pinned Marker */}
            {clickedCoord && (
              <Marker position={[clickedCoord.lat, clickedCoord.lng]} icon={createPinMarker()}>
                <Popup>
                  <div className="p-1 text-slate-900 text-xs font-bold font-mono">
                    {clickedCoord.lat.toFixed(4)}°N, {clickedCoord.lng.toFixed(4)}°E
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Color Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-[400] p-2.5 rounded-2xl glass-panel text-[10px] text-slate-300 font-medium space-y-1 hidden md:block">
            <span className="font-mono font-bold text-white block uppercase">AQI Breakpoints</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#00E6A0]" /> 0-50 Good</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" /> 51-100 Mod</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF9F43]" /> 101-200 Sens</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" /> 201-300 Unhealthy</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FF4560]" /> 301-400 Very Poor</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#991B1B]" /> 401+ Haz</span>
            </div>
          </div>
        </div>

        {/* Selected Station / Coordinate Drawer */}
        <div className="glass-panel rounded-3xl p-5 shadow-xl flex flex-col justify-between overflow-y-auto">
          {selectedStation && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  CAAQMS Station Telemetry
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">{selectedStation.name}</h3>
                <p className="text-xs text-slate-400">
                  {selectedStation.city} • Code: {selectedStation.code}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-mono">Ambient AQI</span>
                  <div className="text-3xl font-black text-white">
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
                <span className="text-slate-400 font-mono font-bold uppercase text-[10px] block">
                  Sensor Telemetry
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] font-mono">PM2.5</span>
                    <div className="font-bold text-white text-sm">
                      {selectedStation.pm25 ?? '—'} µg/m³
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] font-mono">PM10</span>
                    <div className="font-bold text-white text-sm">
                      {selectedStation.pm10 ?? '—'} µg/m³
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] font-mono">NO2</span>
                    <div className="font-bold text-white text-sm">
                      {selectedStation.no2 ?? '—'} µg/m³
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] font-mono">Dominant</span>
                    <div className="font-bold text-cyan-400 text-sm uppercase">
                      {selectedStation.dominant_pollutant}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
                GPS: {selectedStation.latitude.toFixed(4)}°N, {selectedStation.longitude.toFixed(4)}°E
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onSelectStationForForecast(selectedStation.id)}
                  className="w-full btn-cinematic-cyan py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-glow-cyan"
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
                    className="w-full btn-cinematic-glass py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View in 360° Street View</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {clickedCoord && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Custom Pinned Coordinate
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
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Calculated AQI</div>
                      <div className="text-3xl font-black text-white">
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
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] font-mono">PM2.5</span>
                      <div className="font-bold text-slate-200">
                        {clickedAtmosphere.air_quality.pm25 ?? '—'} µg/m³
                      </div>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] font-mono">PM10</span>
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
                      className="w-full btn-cinematic-cyan py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
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
export default MapPage;
