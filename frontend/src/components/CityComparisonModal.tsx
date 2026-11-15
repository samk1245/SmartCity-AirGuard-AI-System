import React, { useState } from 'react';
import { X, ArrowRightLeft, MapPin, Wind, Thermometer, Droplets } from 'lucide-react';
import { City, CurrentSummary } from '../types';
import { AQIBadge } from './AQIBadge';
import { ThreeDIcon } from './ThreeDIcon';

interface CityComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: City[];
  currentCity: string;
}

export const CityComparisonModal: React.FC<CityComparisonModalProps> = ({
  isOpen,
  onClose,
  cities,
  currentCity
}) => {
  const [cityA, setCityA] = useState<string>(currentCity !== 'All' ? currentCity : 'Delhi');
  const [cityB, setCityB] = useState<string>('Mumbai');
  const [cityC, setCityC] = useState<string>('Bengaluru');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-forest-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass-panel border border-emerald-500/30 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-spatial-glass space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-mint-300 border border-emerald-500/30 shadow-glow-emerald">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Urban Air Quality Comparison Engine</h2>
              <p className="text-xs text-slate-300">
                Compare multi-city pollution baselines, particulate concentrations, and climatic conditions across India
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-slate-400 hover:text-white border border-emerald-500/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">City 1</label>
            <select
              value={cityA}
              onChange={(e) => setCityA(e.target.value)}
              className="w-full bg-forest-900 border border-emerald-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.name} className="bg-forest-900 text-white">
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">City 2</label>
            <select
              value={cityB}
              onChange={(e) => setCityB(e.target.value)}
              className="w-full bg-forest-900 border border-emerald-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.name} className="bg-forest-900 text-white">
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">City 3 (Optional)</label>
            <select
              value={cityC}
              onChange={(e) => setCityC(e.target.value)}
              className="w-full bg-forest-900 border border-emerald-500/25 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              <option value="" className="bg-forest-900 text-white">None</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name} className="bg-forest-900 text-white">
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[cityA, cityB, cityC].filter(Boolean).map((cityName, idx) => {
            const cityObj = cities.find((c) => c.name === cityName);
            if (!cityObj) return null;

            return (
              <div
                key={cityName}
                className="glass-card rounded-2xl p-5 shadow-glass flex flex-col justify-between border border-emerald-500/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-mint-400 font-mono">
                      City #{idx + 1}
                    </span>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-black text-white">{cityObj.name}</h3>
                  <p className="text-xs text-slate-300">{cityObj.state}, India</p>

                  <div className="mt-4 p-3 rounded-xl bg-forest-950/70 border border-emerald-900/40 space-y-2">
                    <div className="text-xs text-slate-300 font-semibold uppercase font-mono">
                      Monitoring Stations ({cityObj.stations.length})
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {cityObj.stations.map((st) => (
                        <li key={st.id} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="truncate">{st.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-900/40 text-xs text-slate-400 font-mono">
                  Coordinates: {cityObj.latitude.toFixed(2)}°N, {cityObj.longitude.toFixed(2)}°E
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="btn-cinematic-emerald px-6 py-2.5 rounded-xl text-xs font-bold"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
