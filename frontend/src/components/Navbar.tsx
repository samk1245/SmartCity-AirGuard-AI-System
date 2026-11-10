import React, { useState, useEffect } from 'react';
import {
  Wind,
  ShieldAlert,
  Bell,
  RefreshCw,
  Cpu,
  Globe,
  Compass,
  Crosshair,
  Volume2,
  VolumeX,
  Search,
  Sun,
  Moon,
  User,
  Radio
} from 'lucide-react';
import { City } from '../types';
import { isSoundEnabled, setSoundEnabled, playCyberClick } from '../utils/audioSystem';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  cities: City[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenGlobalSearch: () => void;
  onNavigateToEarth3D?: () => void;
  onNavigateToStreetView?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  unreadAlertsCount,
  onOpenAlerts,
  onRefresh,
  isRefreshing,
  onOpenGlobalSearch,
  onNavigateToEarth3D,
  onNavigateToStreetView,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [soundActive, setSoundActive] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setSoundActive(isSoundEnabled());
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundEnabled(next);
    setSoundActive(next);
    if (next) playCyberClick();
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Wind className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white tracking-tight">
                AirGuard <span className="gradient-text-cyan">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                48 Cities
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block">
              Smart City Environmental Intelligence Platform
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => {
              playCyberClick();
              onOpenGlobalSearch();
            }}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-700/80 hover:border-cyan-500/40 text-xs text-slate-400 transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Search smart cities, stations, predictive models...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live Telemetry Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>UTC+5:30: <strong className="text-white">{currentTime}</strong></span>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 font-mono hidden sm:inline">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[150px] truncate"
            >
              <option value="All" className="bg-slate-900">All Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name} className="bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              playCyberClick();
              onRefresh();
            }}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Refresh Real-Time Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-colors ${
              soundActive
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 shadow-glow-cyan'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={soundActive ? 'Sound Feedback Enabled' : 'Sound Feedback Disabled'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={() => {
                playCyberClick();
                onToggleTheme();
              }}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-amber-300 transition-colors"
              title={theme === 'dark' ? 'Switch to Daylight Theme' : 'Switch to Midnight Theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                playCyberClick();
                setIsNotificationOpen(!isNotificationOpen);
              }}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Environmental Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-rose-500 text-[9px] font-mono font-bold text-white">
                    {unreadAlertsCount}
                  </span>
                </span>
              )}
            </button>

            <NotificationCenter
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              onNavigateToAlerts={onOpenAlerts}
            />
          </div>

          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:block text-left text-xs">
              <span className="font-bold text-white block leading-tight">Admin Station</span>
              <span className="text-[10px] text-cyan-400 font-mono">CPCB Analyst</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
