import React, { useState, useEffect } from 'react';
import {
  Navigation,
  ArrowRight,
  Plane,
  Train,
  Car,
  Clock,
  AlertTriangle,
  Luggage,
  Info
} from 'lucide-react';
import { City } from '../types';

interface TravelAirCheckPageProps {
  cities?: City[];
  onSelectCity?: (city: string) => void;
}

export const TravelAirCheckPage: React.FC<TravelAirCheckPageProps> = ({ cities = [], onSelectCity }) => {
  const [originCity, setOriginCity] = useState<string>('Bengaluru');
  const [destinationCity, setDestinationCity] = useState<string>('Delhi');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fallback city list if not loaded yet
  const cityNames = cities.length > 0
    ? cities.map((c) => c.name)
    : [
        'Delhi', 'Lucknow', 'Prayagraj', 'Kanpur', 'Varanasi',
        'Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Ahmedabad',
        'Jaipur', 'Patna', 'Agra', 'Pune', 'Chandigarh',
        'Chennai', 'Bhopal', 'Indore', 'Dehradun', 'Guwahati',
        'Srinagar', 'Visakhapatnam', 'Kochi', 'Bhubaneswar', 'Ranchi',
        'Raipur', 'Amritsar', 'Surat', 'Nagpur', 'Shimla',
        'Thiruvananthapuram', 'Coimbatore', 'Madurai', 'Kozhikode', 'Vijayawada',
        'Tirupati', 'Mangaluru', 'Hubballi-Dharwad', 'Jamshedpur', 'Dhanbad',
        'Gwalior', 'Jabalpur', 'Kota', 'Jodhpur', 'Udaipur', 'Panaji', 'Leh', 'Gangtok'
      ];

  const fetchRouteAnalysis = async (fromCity: string, toCity: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/travel/route-analysis?origin=${encodeURIComponent(fromCity)}&destination=${encodeURIComponent(toCity)}`);
      if (res.ok) {
        const data = await res.json();
        setAnalysisData(data);
      }
    } catch (err) {
      console.error('Failed to load travel route analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouteAnalysis(originCity, destinationCity);
  }, [originCity, destinationCity]);

  const handleSwapCities = () => {
    const temp = originCity;
    setOriginCity(destinationCity);
    setDestinationCity(temp);
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#84cc16';
    if (aqi <= 200) return '#f59e0b';
    if (aqi <= 300) return '#f97316';
    if (aqi <= 400) return '#ef4444';
    return '#7f1d1d';
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-950/40 border border-emerald-900/40 shadow-glow-emerald/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Navigation className="w-4 h-4 text-emerald-400" />
              Inter-City Route Environmental Intelligence
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Travel Air Guard — Trip Exposure Planner
            </h1>
            <p className="text-sm text-forest-200 mt-1 max-w-2xl">
              Calculate respiratory exposure deltas between departure and destination cities across India.
              Receive optimal diurnal transit windows, transport cabin filtration ratings, and packing essentials.
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-forest-900/90 border border-emerald-500/30 text-emerald-300 font-semibold shadow-glow-emerald/20">
              48+ Indian Cities Unified
            </span>
          </div>
        </div>

        {/* Route Selector Card */}
        <div className="mt-6 pt-5 border-t border-emerald-900/40 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
          {/* Origin Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-emerald-400" /> Origin / Departure City
            </label>
            <select
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-forest-950 border border-emerald-900/60 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition"
            >
              {cityNames.map((c) => (
                <option key={c} value={c} className="bg-forest-950 text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center pt-4 md:pt-0">
            <button
              onClick={handleSwapCities}
              className="p-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-emerald-400 border border-emerald-700/50 transition shadow-md hover:scale-105 active:scale-95 hover:shadow-glow-emerald/20"
              title="Swap Origin and Destination"
            >
              <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
            </button>
          </div>

          {/* Destination Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-mint-400" /> Destination City
            </label>
            <select
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-forest-950 border border-emerald-900/60 text-white font-semibold text-sm focus:outline-none focus:border-mint-400 focus:ring-1 focus:ring-mint-400/40 transition"
            >
              {cityNames.map((c) => (
                <option key={c} value={c} className="bg-forest-950 text-white">{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Analysis Cards */}
      {analysisData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Side by Side Cities Comparison */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin City Card */}
              <div
                onClick={() => onSelectCity?.(analysisData.origin.city)}
                className={`p-5 rounded-2xl glass-card bg-forest-950/80 border border-emerald-500/25 hover:border-emerald-400/50 transition shadow-glass space-y-3 ${
                  onSelectCity ? 'cursor-pointer hover:scale-[1.02]' : ''
                }`}
                title={onSelectCity ? `Switch Dashboard to ${analysisData.origin.city}` : undefined}
              >
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="uppercase font-mono font-bold tracking-wider text-emerald-400">Departure Point</span>
                  <span className="font-mono">{analysisData.origin.state}</span>
                </div>
                <h3 className="text-xl font-black text-white">{analysisData.origin.city}</h3>

                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl font-black"
                    style={{ color: getAqiColor(analysisData.origin.aqi) }}
                  >
                    AQI {analysisData.origin.aqi}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    ({analysisData.origin.category})
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">PM2.5</span>
                    <span className="text-mint-300 font-bold font-mono">{analysisData.origin.pm25} µg/m³</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">PM10</span>
                    <span className="text-mint-300 font-bold font-mono">{analysisData.origin.pm10} µg/m³</span>
                  </div>
                </div>
              </div>

              {/* Destination City Card */}
              <div
                onClick={() => onSelectCity?.(analysisData.destination.city)}
                className={`p-5 rounded-2xl glass-card bg-forest-950/80 border border-emerald-500/25 hover:border-emerald-400/50 transition shadow-glass space-y-3 ${
                  onSelectCity ? 'cursor-pointer hover:scale-[1.02]' : ''
                }`}
                title={onSelectCity ? `Switch Dashboard to ${analysisData.destination.city}` : undefined}
              >
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="uppercase font-mono font-bold tracking-wider text-mint-400">Arrival Destination</span>
                  <span className="font-mono">{analysisData.destination.state}</span>
                </div>
                <h3 className="text-xl font-black text-white">{analysisData.destination.city}</h3>

                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl font-black"
                    style={{ color: getAqiColor(analysisData.destination.aqi) }}
                  >
                    AQI {analysisData.destination.aqi}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    ({analysisData.destination.category})
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">PM2.5</span>
                    <span className="text-mint-300 font-bold font-mono">{analysisData.destination.pm25} µg/m³</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">PM10</span>
                    <span className="text-mint-300 font-bold font-mono">{analysisData.destination.pm10} µg/m³</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exposure Delta Verdict */}
            <div className="p-5 rounded-2xl bg-forest-950/80 border border-emerald-900/40 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-300">
                  Calculated Environmental Exposure Shift
                </span>
                <span
                  className="text-xs font-extrabold px-2.5 py-1 rounded-full uppercase"
                  style={{
                    backgroundColor: `${analysisData.verdict_color}20`,
                    color: analysisData.verdict_color,
                    border: `1px solid ${analysisData.verdict_color}40`
                  }}
                >
                  {analysisData.trip_verdict}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-white">
                  {analysisData.exposure_delta_percent > 0 ? `+${analysisData.exposure_delta_percent}%` : `${analysisData.exposure_delta_percent}%`}
                </span>
                <span className="text-xs text-forest-200">
                  {analysisData.summary_statement}
                </span>
              </div>

              {/* Timing Advisories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-emerald-900/40">
                <div className="p-3 rounded-xl bg-forest-900/60 border border-emerald-900/50">
                  <span className="text-[11px] font-bold text-mint-400 uppercase flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-mint-400" /> Optimal Travel Arrival Window
                  </span>
                  <p className="text-xs text-forest-200">{analysisData.optimal_arrival_window}</p>
                </div>

                <div className="p-3 rounded-xl bg-forest-900/60 border border-emerald-900/50">
                  <span className="text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Peak Smog Trapping Hours
                  </span>
                  <p className="text-xs text-forest-200">{analysisData.suboptimal_arrival_window}</p>
                </div>
              </div>
            </div>

            {/* Transit Mode Cabin Air Filtration Ratings */}
            <div className="p-5 rounded-2xl bg-forest-950/80 border border-emerald-900/40 shadow-lg space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                Transit Mode Cabin Air Filtration Comparison
              </h3>

              <div className="space-y-2.5 pt-1">
                {analysisData.transit_modes.map((tm: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl bg-forest-900/60 border border-emerald-900/50 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-forest-950 border border-emerald-900/60 text-emerald-400">
                      {tm.icon === 'plane' && <Plane className="w-4 h-4" />}
                      {tm.icon === 'train' && <Train className="w-4 h-4" />}
                      {tm.icon === 'car' && <Car className="w-4 h-4" />}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="text-xs font-bold text-white">{tm.mode}</div>
                      <p className="text-[11px] text-forest-300">{tm.cabin_air_note}</p>
                      <div className="text-[11px] font-semibold text-emerald-400 pt-0.5">
                        Advisory: {tm.advisory}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Luggage Checklist & Tips */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-forest-950/80 border border-emerald-900/40 shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                <Luggage className="w-4 h-4" /> Travel Packing Checklist
              </div>
              <h3 className="text-base font-bold text-white">Health Protection Gear</h3>
              <p className="text-xs text-forest-300">
                Recommended items for your destination based on current {analysisData.destination.city} air quality.
              </p>

              <div className="space-y-2 pt-2">
                {analysisData.packing_checklist.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-forest-900/60 border border-emerald-900/50 flex items-center justify-between text-xs"
                  >
                    <span className="text-forest-100 font-medium">{item.item}</span>
                    {item.essential ? (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        ESSENTIAL
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-forest-950 text-forest-400 border border-emerald-900/40">
                        OPTIONAL
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Advisory Disclaimer */}
            <div className="p-4 rounded-xl bg-forest-950 border border-emerald-900/40 text-xs text-forest-300 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <Info className="w-4 h-4 text-emerald-400" />
                Travel Health Advice
              </div>
              <p className="text-[11px] text-forest-400 leading-relaxed">
                Individuals with asthma, cardiac concerns, or expectant mothers traveling to high-pollution zones should consult their physician and carry emergency rescue medications in their carry-on luggage.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
