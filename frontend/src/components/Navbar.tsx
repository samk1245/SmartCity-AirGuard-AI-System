import React from 'react';
import { Wind, ShieldAlert, Bell, RefreshCw, Cpu } from 'lucide-react';
import { City } from '../types';

interface NavbarProps {
  cities: City[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  unreadAlertsCount,
  onOpenAlerts,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-3.5">
      <div className="flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Wind className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                AirGuard <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                SmartCity
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Intelligent Urban Air Pollution & Environmental Forecasting
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* City Selector */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-sm">
            <span className="text-xs text-slate-400 font-medium">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-800">All Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name} className="bg-slate-800">
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          {/* Model Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>AI Model v1.0 Active</span>
          </div>

          {/* Alerts Notification Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="View Active Pollution Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-bounce shadow-lg shadow-rose-500/40">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh Station Data"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
