import React, { useState, useEffect } from 'react';
import {
  Navigation,
  ArrowRight,
  Plane,
  Train,
  Car,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Luggage,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { api } from '../services/api';
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Navigation className="w-4 h-4" />
              Inter-City Route Environmental Intelligence
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Travel Air Guard — Trip Exposure Planner
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Calculate respiratory exposure deltas between departure and destination cities across India.
              Receive optimal diurnal transit windows, transport cabin filtration ratings, and packing essentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
              48+ Indian Cities Unified
            </span>
          </div>
        </div>

        {/* Route Selector Card */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Origin Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-cyan-400" /> Origin / Departure City
            </label>
            <select
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-cyan-500 transition"
            >
              {cityNames.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center pt-4 md:pt-0">
            <button
              onClick={handleSwapCities}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition shadow-md hover:scale-105 active:scale-95"
              title="Swap Origin and Destination"
            >
              <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
            </button>
          </div>

          {/* Destination Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-rose-400" /> Destination City
            </label>
            <select
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-rose-500 transition"
            >
              {cityNames.map((c) => (
                <option key={c} value={c}>{c}</option>
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
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase font-bold tracking-wider">Departure Point</span>
                  <span>{analysisData.origin.state}</span>
                </div>
                <h3 className="text-xl font-black text-white">{analysisData.origin.city}</h3>

                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl font-black"
                    style={{ color: getAqiColor(analysisData.origin.aqi) }}
                  >
                    AQI {analysisData.origin.aqi}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    ({analysisData.origin.category})
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">PM2.5</span>
                    <span className="text-slate-200 font-bold">{analysisData.origin.pm25} µg/m³</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">PM10</span>
                    <span className="text-slate-200 font-bold">{analysisData.origin.pm10} µg/m³</span>
                  </div>
                </div>
              </div>

              {/* Destination City Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase font-bold tracking-wider text-rose-400">Arrival Destination</span>
                  <span>{analysisData.destination.state}</span>
                </div>
                <h3 className="text-xl font-black text-white">{analysisData.destination.city}</h3>

                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl font-black"
                    style={{ color: getAqiColor(analysisData.destination.aqi) }}
                  >
                    AQI {analysisData.destination.aqi}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    ({analysisData.destination.category})
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">PM2.5</span>
                    <span className="text-slate-200 font-bold">{analysisData.destination.pm25} µg/m³</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">PM10</span>
                    <span className="text-slate-200 font-bold">{analysisData.destination.pm10} µg/m³</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exposure Delta Verdict */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
                <span className="text-xs text-slate-300">
                  {analysisData.summary_statement}
                </span>
              </div>

              {/* Timing Advisories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5" /> Optimal Travel Arrival Window
                  </span>
                  <p className="text-xs text-slate-300">{analysisData.optimal_arrival_window}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[11px] font-bold text-rose-400 uppercase flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Peak Smog Trapping Hours
                  </span>
                  <p className="text-xs text-slate-300">{analysisData.suboptimal_arrival_window}</p>
                </div>
              </div>
            </div>

            {/* Transit Mode Cabin Air Filtration Ratings */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                Transit Mode Cabin Air Filtration Comparison
              </h3>

              <div className="space-y-2.5 pt-1">
                {analysisData.transit_modes.map((tm: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                      {tm.icon === 'plane' && <Plane className="w-4 h-4" />}
                      {tm.icon === 'train' && <Train className="w-4 h-4" />}
                      {tm.icon === 'car' && <Car className="w-4 h-4" />}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="text-xs font-bold text-white">{tm.mode}</div>
                      <p className="text-[11px] text-slate-400">{tm.cabin_air_note}</p>
                      <div className="text-[11px] font-semibold text-cyan-400 pt-0.5">
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
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                <Luggage className="w-4 h-4" /> Travel Packing Checklist
              </div>
              <h3 className="text-base font-bold text-white">Health Protection Gear</h3>
              <p className="text-xs text-slate-400">
                Recommended items for your destination based on current {analysisData.destination.city} air quality.
              </p>

              <div className="space-y-2 pt-2">
                {analysisData.packing_checklist.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-200 font-medium">{item.item}</span>
                    {item.essential ? (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        ESSENTIAL
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        OPTIONAL
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Advisory Disclaimer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <Info className="w-4 h-4 text-cyan-400" />
                Travel Health Advice
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Individuals with asthma, cardiac concerns, or expectant mothers traveling to high-pollution zones should consult their physician and carry emergency rescue medications in their carry-on luggage.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
