import React, { useState } from 'react';
import {
  LayoutDashboard,
  Globe,
  Compass,
  Sliders,
  Activity,
  LineChart,
  Sparkles,
  MapPin,
  AlertTriangle,
  UploadCloud,
  Cpu,
  Settings,
  Info,
  Building2,
  Radio,
  Flame,
  Heart,
  Trophy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'explorer'
  | 'nearby'
  | 'pollutants'
  | 'health'
  | 'scoreboard'
  | 'earth3d'
  | 'streetview'
  | 'scenario'
  | 'live'
  | 'historical'
  | 'forecast'
  | 'map'
  | 'alerts'
  | 'upload'
  | 'model'
  | 'settings'
  | 'about';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadAlertsCount: number;
}

interface SidebarMenuItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  unreadAlertsCount
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const primaryMenuItems: SidebarMenuItem[] = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'City & State Explorer', icon: Building2, badge: '36 States', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' },
    { id: 'nearby', label: 'Nearby Station Radar', icon: Radio, badge: 'GPS', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
    { id: 'pollutants', label: 'Pollutant Deep Dive', icon: Flame },
    { id: 'health', label: 'Health & Outdoor Planner', icon: Heart },
    { id: 'scoreboard', label: 'India AQI Scoreboard', icon: Trophy, badge: 'RANK', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
  ];

  const immersiveVisualItems: SidebarMenuItem[] = [
    { id: 'earth3d', label: '3D Earth & Atmosphere', icon: Globe, badge: '3D', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' },
    { id: 'streetview', label: 'Street View Explorer', icon: Compass, badge: '360°', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
    { id: 'map', label: 'Interactive Pollution Map', icon: MapPin },
    { id: 'scenario', label: '"What-If" Policy Studio', icon: Sliders, badge: 'SIM', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40' },
  ];

  const analyticsAndSystemItems: SidebarMenuItem[] = [
    { id: 'live', label: 'Live Station Quality', icon: Activity },
    { id: 'forecast', label: 'AI Pollution Forecast', icon: Sparkles, badge: 'ML' },
    { id: 'historical', label: 'Historical Analytics', icon: LineChart },
    {
      id: 'alerts',
      label: 'Alerts & Health Risks',
      icon: AlertTriangle,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount.toString() : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'upload', label: 'Dataset Upload & Ingest', icon: UploadCloud },
    { id: 'model', label: 'ML Performance & Train', icon: Cpu },
    { id: 'settings', label: 'Configuration & APIs', icon: Settings },
    { id: 'about', label: 'Methodology & Standards', icon: Info },
  ];

  const renderItem = (item: SidebarMenuItem) => {
    const Icon = item.icon;
    const isActive = currentTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onTabChange(item.id)}
        title={collapsed ? item.label : undefined}
        className={`w-full flex items-center ${
          collapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
        } rounded-xl text-xs font-semibold transition-all ${
          isActive
            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-950/50'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Icon
            className={`w-4 h-4 flex-shrink-0 ${
              isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
            }`}
          />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </div>
        {!collapsed && item.badge && (
          <span
            className={`text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 ${
              item.badgeColor || 'bg-cyan-950 text-cyan-400 border border-cyan-800'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-3 min-h-[calc(100vh-65px)] transition-all duration-300 select-none`}
    >
      <div className="space-y-4 overflow-y-auto pr-1">
        {/* Toggle Collapse Button */}
        <div className="flex items-center justify-between px-1">
          {!collapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Navigation
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition ml-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Section 1: Core Intelligence */}
        <nav className="space-y-1">
          {primaryMenuItems.map(renderItem)}
        </nav>

        {/* Section 2: Immersive 3D & GIS */}
        <div className="pt-2 border-t border-slate-800/80">
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Immersive 3D & Maps
            </div>
          )}
          <nav className="space-y-1">
            {immersiveVisualItems.map(renderItem)}
          </nav>
        </div>

        {/* Section 3: Telemetry & ML */}
        <div className="pt-2 border-t border-slate-800/80">
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Analytics & Engine
            </div>
          )}
          <nav className="space-y-1">
            {analyticsAndSystemItems.map(renderItem)}
          </nav>
        </div>
      </div>

      {/* Attribution footer */}
      {!collapsed && (
        <div className="pt-3 border-t border-slate-800/80 px-2 text-[11px] text-slate-500">
          <p className="font-semibold text-slate-400">CPCB NAQI 2.0</p>
          <p className="text-[10px] text-slate-500 mt-0.5">36 States & UTs Unified</p>
        </div>
      )}
    </aside>
  );
};
