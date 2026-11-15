import React, { useState, useEffect } from 'react';
import {
  Wind,
  Bell,
  RefreshCw,
  Search,
  Sun,
  Moon,
  User,
  Volume2,
  VolumeX,
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
    <header className="sticky top-0 z-30 glass-panel border-b border-emerald-500/20 px-4 sm:px-6 py-3 backdrop-blur-2xl transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        {/* Brand identity: Forest & Emerald spatial mark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-mint-300 flex items-center justify-center shadow-glow-emerald border border-mint-300/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            <Wind className="w-5 h-5 text-forest-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white tracking-tight">
                AirGuard <span className="gradient-text-emerald">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-forest-900/90 text-mint-300 border border-emerald-500/40 shadow-inner">
                48 Cities
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden lg:block font-medium">
              Smart City Environmental Intelligence Platform
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar Trigger (Apple Vision Pro Glass Pill) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => {
              playCyberClick();
              onOpenGlobalSearch();
            }}
            className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-forest-950/75 hover:bg-forest-900/90 border border-emerald-500/25 hover:border-emerald-400/50 text-xs text-slate-300 transition-all shadow-inner group backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Search smart cities, stations, predictive models...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] bg-forest-900 px-2 py-0.5 rounded-md text-mint-300 border border-emerald-500/30">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live Telemetry Clock with Breathing Green Beacon */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-forest-950/80 border border-emerald-500/25 text-[11px] font-mono text-slate-200 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-glow-emerald" />
            </span>
            <span>UTC+5:30: <strong className="text-white">{currentTime}</strong></span>
          </div>

          {/* City Selector Pill */}
          <div className="flex items-center gap-1.5 bg-forest-950/85 border border-emerald-500/25 rounded-xl px-3 py-1.5 text-xs backdrop-blur-md">
            <span className="text-slate-300 font-mono hidden sm:inline text-[11px]">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[150px] truncate"
            >
              <option value="All" className="bg-forest-900 text-white">All Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name} className="bg-forest-900 text-white">
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
            className="p-2.5 rounded-xl bg-forest-950/80 hover:bg-forest-900 border border-emerald-500/25 text-slate-300 hover:text-mint-300 transition-all hover:scale-105 active:scale-95"
            title="Refresh Real-Time Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-mint-400' : ''}`} />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
              soundActive
                ? 'bg-emerald-500/20 border-emerald-400/50 text-mint-300 shadow-glow-emerald'
                : 'bg-forest-950/80 border-emerald-500/25 text-slate-400 hover:text-white'
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
              className="p-2.5 rounded-xl bg-forest-950/80 border border-emerald-500/25 text-slate-300 hover:text-pista-300 transition-all hover:scale-105 active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
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
              className="relative p-2.5 rounded-xl bg-forest-950/80 hover:bg-forest-900 border border-emerald-500/25 text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95"
              title="Environmental Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-rose-500 text-[9px] font-mono font-bold text-white shadow-glow-red">
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
          <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-emerald-500/20">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-mint-400 flex items-center justify-center text-forest-950 font-bold text-xs shadow-glow-emerald">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:block text-left text-xs">
              <span className="font-bold text-white block leading-tight">Admin Station</span>
              <span className="text-[10px] text-mint-300 font-mono font-semibold">CPCB Analyst</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
