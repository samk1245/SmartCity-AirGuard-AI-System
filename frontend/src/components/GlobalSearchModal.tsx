import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  MapPin,
  Building2,
  Activity,
  Sparkles,
  Sliders,
  Globe,
  Radio,
  FileText,
  AlertTriangle,
  ArrowRight,
  Compass,
  Trophy,
  Plane
} from 'lucide-react';
import { City } from '../types';
import { NavTab } from './Sidebar';
import { playCyberClick } from '../utils/audioSystem';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: City[];
  onSelectCity: (city: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: 'City' | 'Navigation' | 'Simulation' | 'Analytics';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  cities,
  onSelectCity,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build searchable index
  const navigationItems: SearchItem[] = [
    { id: 'tab-dash', title: 'Live Overview Dashboard', category: 'Navigation', description: 'Real-time telemetry, 3D city twin, and national AQI overview', icon: Activity, action: () => { onNavigateTab('dashboard'); onClose(); } },
    { id: 'tab-pred', title: 'AI Pollution Predictions & Forecast', category: 'Navigation', description: '24h, 3-day, 7-day quantile forecasts with HistGradientBoosting', icon: Sparkles, action: () => { onNavigateTab('forecast'); onClose(); } },
    { id: 'tab-map', title: 'Interactive 3D Smart City Map', category: 'Navigation', description: 'CPCB towers, pollution heatmaps, traffic, and industrial zones', icon: MapPin, action: () => { onNavigateTab('map'); onClose(); } },
    { id: 'tab-hotspots', title: 'Pollution Hotspots Detection', category: 'Analytics', description: 'Top 10 national hotspots, surge rates, and zone classifications', icon: AlertTriangle, action: () => { onNavigateTab('hotspots' as any); onClose(); } },
    { id: 'tab-comp', title: 'Multi-City Comparison Module', category: 'Analytics', description: 'Compare 2 to 4 cities side-by-side with radar charts', icon: Building2, action: () => { onNavigateTab('comparison' as any); onClose(); } },
    { id: 'tab-ecoai', title: 'ECO AI Environmental Assistant', category: 'Navigation', description: 'Context-aware conversational air quality advisor', icon: Sparkles, action: () => { onNavigateTab('assistant' as any); onClose(); } },
    { id: 'tab-analytics', title: 'Environmental Impact & Insights', category: 'Analytics', description: 'Daily/weekly trends, weather correlation, and cigarette index', icon: FileText, action: () => { onNavigateTab('analytics' as any); onClose(); } },
    { id: 'tab-admin', title: 'Smart City Admin Panel', category: 'Navigation', description: 'Station health, telemetry frequency, model diagnostics, alerts', icon: Sliders, action: () => { onNavigateTab('admin' as any); onClose(); } },
    { id: 'tab-earth', title: '3D Earth & Atmosphere Globe', category: 'Simulation', description: 'WebGL planetary model with continental smog corridors', icon: Globe, action: () => { onNavigateTab('earth3d'); onClose(); } },
    { id: 'tab-plume', title: '3D Plume Dispersion Simulator', category: 'Simulation', description: 'Gaussian plume physics for industrial smokestack emissions', icon: Compass, action: () => { onNavigateTab('plume'); onClose(); } },
    { id: 'tab-travel', title: 'Travel Air Guard Route Planner', category: 'Analytics', description: 'Comparative transit exposure and cabin filtration advisories', icon: Plane, action: () => { onNavigateTab('travel'); onClose(); } },
    { id: 'tab-score', title: 'National India Pollution Scoreboard', category: 'Analytics', description: 'Rankings of cleanest havens vs most polluted municipal centers', icon: Trophy, action: () => { onNavigateTab('scoreboard'); onClose(); } },
  ];

  const cityItems: SearchItem[] = cities.map((c) => ({
    id: `city-${c.id}`,
    title: `${c.name}, ${c.state}`,
    category: 'City',
    description: `${c.stations?.length || 1} CAAQMS Continuous Monitoring Towers`,
    icon: Building2,
    action: () => {
      onSelectCity(c.name);
      onNavigateTab('dashboard');
      onClose();
    },
  }));

  const allItems = [...navigationItems, ...cityItems];
  const filtered = query.trim()
    ? allItems.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.description.toLowerCase().includes(query.toLowerCase()) ||
          i.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl overflow-hidden shadow-glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-700/60 bg-slate-900/90 gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search smart cities, stations, predictive models, simulation tools..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching smart city entities or system modules found for &quot;{query}&quot;.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playCyberClick();
                    item.action();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/40">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-cyan-300">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-md">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Quick teleportation across 48 Indian Smart Cities & 111 CAAQMS Towers</span>
          <span className="font-mono text-cyan-400">AirGuard AI 2.0 Command Center</span>
        </div>
      </div>
    </div>
  );
};
export default GlobalSearchModal;

