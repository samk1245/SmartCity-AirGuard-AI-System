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
  ChevronRight,
  Plane,
  Wind,
  Droplets,
  FileText,
  Bot,
  ArrowRightLeft,
  Lock,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { playCyberClick } from '../utils/audioSystem';

export type NavTab =
  | 'dashboard'
  | 'live'
  | 'forecast'
  | 'map'
  | 'hotspots'
  | 'comparison'
  | 'analytics'
  | 'assistant'
  | 'alerts'
  | 'reports'
  | 'admin'
  | 'explorer'
  | 'travel'
  | 'ecoshield'
  | 'nearby'
  | 'pollutants'
  | 'health'
  | 'scoreboard'
  | 'earth3d'
  | 'plume'
  | 'streetview'
  | 'scenario'
  | 'historical'
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
  unreadAlertsCount,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Group 1: Core Intelligence Platform (Section 15 requirements)
  const corePlatformItems: SidebarMenuItem[] = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Station Quality', icon: Activity, badge: 'LIVE', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
    { id: 'forecast', label: 'AI Predictions', icon: Sparkles, badge: 'ML', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' },
    { id: 'map', label: '3D City & GIS Map', icon: MapPin },
    { id: 'hotspots', label: 'Pollution Hotspots', icon: Flame, badge: 'NEW', badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/40' },
    { id: 'comparison', label: 'City Comparison', icon: ArrowRightLeft },
    { id: 'analytics', label: 'Environmental Analytics', icon: FileText },
    { id: 'assistant', label: 'ECO AI Assistant', icon: Bot, badge: 'AI', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40' },
    {
      id: 'alerts',
      label: 'Alerts & Notifications',
      icon: AlertTriangle,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount.toString() : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
    { id: 'admin', label: 'Smart City Admin', icon: Lock, badge: 'RBAC', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
  ];

  // Group 2: Advanced Digital Twins & Interactive Physics
  const immersiveTwinItems: SidebarMenuItem[] = [
    { id: 'ecoshield', label: 'Eco-Shield & Fluid Wave', icon: Droplets, badge: 'FLUID', badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/40' },
    { id: 'earth3d', label: '3D Earth & Atmosphere', icon: Globe, badge: '3D', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' },
    { id: 'plume', label: '3D Plume Dispersion', icon: Wind, badge: 'PHYSICS', badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' },
    { id: 'streetview', label: '360° Street View', icon: Compass, badge: '360°', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
    { id: 'scenario', label: '"What-If" Policy Studio', icon: Sliders, badge: 'SIM', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40' },
    { id: 'travel', label: 'Travel Air Guard', icon: Plane, badge: 'TRIP', badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/40' },
    { id: 'scoreboard', label: 'India AQI Scoreboard', icon: Trophy, badge: 'RANK', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
    { id: 'explorer', label: 'City & State Directory', icon: Building2, badge: '36 States', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' },
  ];

  // Group 3: Analytics & System Tools
  const toolItems: SidebarMenuItem[] = [
    { id: 'nearby', label: 'Nearby Station Radar', icon: Radio, badge: 'GPS', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
    { id: 'pollutants', label: 'Pollutant Deep Dive', icon: Layers },
    { id: 'health', label: 'Health & Activity Planner', icon: Heart },
    { id: 'historical', label: 'Historical Analytics', icon: LineChart },
    { id: 'model', label: 'ML Model Performance', icon: Cpu },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'about', label: 'Specifications & Standards', icon: Info },
  ];

  const renderNavList = (items: SidebarMenuItem[]) => (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              playCyberClick();
              onTabChange(item.id);
            }}
            title={collapsed ? item.label : undefined}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-cyan-300 border-l-4 border-cyan-400 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>

            {!collapsed && item.badge && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold shrink-0 ${
                  item.badgeColor || 'bg-slate-800 text-slate-300'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside
      className={`relative z-20 shrink-0 border-r border-slate-800/80 bg-slate-900/95 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Section with collapse button */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        {!collapsed && (
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400 px-2">
            Command Center
          </span>
        )}
        <button
          onClick={() => {
            playCyberClick();
            setCollapsed(!collapsed);
          }}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors mx-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Core Platform */}
        <div>
          {!collapsed && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 pb-1.5 block">
              Core Intelligence
            </span>
          )}
          {renderNavList(corePlatformItems)}
        </div>

        {/* Digital Twins & Physics */}
        <div>
          {!collapsed && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 pb-1.5 block">
              Digital Twins & 3D
            </span>
          )}
          {renderNavList(immersiveTwinItems)}
        </div>

        {/* Analytics & Tools */}
        <div>
          {!collapsed && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 pb-1.5 block">
              Analytics & Systems
            </span>
          )}
          {renderNavList(toolItems)}
        </div>
      </div>

      {/* Bottom Version Strip */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        {!collapsed ? (
          <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>AirGuard AI v2.5</span>
            <span className="text-cyan-400 font-bold">111 CAAQMS</span>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mx-auto" />
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
