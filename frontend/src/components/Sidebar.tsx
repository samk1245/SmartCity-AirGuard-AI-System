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

  // Group 1: Core Intelligence Platform
  const corePlatformItems: SidebarMenuItem[] = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live Station Quality', icon: Activity, badge: 'LIVE', badgeColor: 'bg-emerald-500/25 text-mint-300 border border-emerald-400/40' },
    { id: 'forecast', label: 'AI Predictions', icon: Sparkles, badge: 'ML', badgeColor: 'bg-mint-500/20 text-pista-300 border border-mint-400/40' },
    { id: 'map', label: '3D City & GIS Map', icon: MapPin },
    { id: 'hotspots', label: 'Pollution Hotspots', icon: Flame, badge: 'HOT', badgeColor: 'bg-rose-500/25 text-rose-300 border border-rose-500/40' },
    { id: 'comparison', label: 'City Comparison', icon: ArrowRightLeft },
    { id: 'analytics', label: 'Environmental Analytics', icon: FileText },
    { id: 'assistant', label: 'ECO AI Assistant', icon: Bot, badge: 'AI', badgeColor: 'bg-emerald-500/25 text-mint-300 border border-emerald-500/40' },
    {
      id: 'alerts',
      label: 'Alerts & Notifications',
      icon: AlertTriangle,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount.toString() : undefined,
      badgeColor: 'bg-rose-500 text-white shadow-glow-red',
    },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
    { id: 'admin', label: 'Smart City Admin', icon: Lock, badge: 'RBAC', badgeColor: 'bg-amber-500/25 text-amber-300 border border-amber-500/40' },
  ];

  // Group 2: Advanced Digital Twins & Interactive Physics
  const immersiveTwinItems: SidebarMenuItem[] = [
    { id: 'ecoshield', label: 'Eco-Shield & Fluid Wave', icon: Droplets, badge: 'FLUID', badgeColor: 'bg-emerald-500/25 text-mint-300 border border-emerald-400/40' },
    { id: 'earth3d', label: '3D Earth & Atmosphere', icon: Globe, badge: '3D', badgeColor: 'bg-mint-500/20 text-pista-200 border border-mint-400/40' },
    { id: 'plume', label: '3D Plume Dispersion', icon: Wind, badge: 'PHYSICS', badgeColor: 'bg-teal-500/25 text-teal-200 border border-teal-400/40' },
    { id: 'streetview', label: '360° Street View', icon: Compass, badge: '360°', badgeColor: 'bg-emerald-500/25 text-mint-300 border border-emerald-400/40' },
    { id: 'scenario', label: '"What-If" Policy Studio', icon: Sliders, badge: 'SIM', badgeColor: 'bg-mint-500/20 text-pista-300 border border-mint-400/40' },
    { id: 'travel', label: 'Travel Air Guard', icon: Plane, badge: 'TRIP', badgeColor: 'bg-emerald-500/25 text-mint-200 border border-emerald-400/40' },
    { id: 'scoreboard', label: 'India AQI Scoreboard', icon: Trophy, badge: 'RANK', badgeColor: 'bg-amber-500/25 text-amber-300 border border-amber-400/40' },
    { id: 'explorer', label: 'City & State Directory', icon: Building2, badge: '36 States', badgeColor: 'bg-mint-500/20 text-pista-300 border border-mint-400/40' },
  ];

  // Group 3: Analytics & System Tools
  const toolItems: SidebarMenuItem[] = [
    { id: 'nearby', label: 'Nearby Station Radar', icon: Radio, badge: 'GPS', badgeColor: 'bg-emerald-500/25 text-mint-300 border border-emerald-400/40' },
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
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500/25 via-emerald-500/10 to-transparent text-mint-300 border-l-[3px] border-emerald-400 font-bold shadow-glow-emerald backdrop-blur-md'
                : 'text-slate-300 hover:text-white hover:bg-forest-900/60 hover:translate-x-0.5'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-mint-300'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>

            {!collapsed && item.badge && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold shrink-0 ${
                  item.badgeColor || 'bg-forest-900 text-slate-300 border border-emerald-500/20'
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
      className={`relative z-20 shrink-0 border-r border-emerald-500/20 glass-panel backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Section with collapse button */}
      <div className="p-3 border-b border-emerald-500/20 flex items-center justify-between">
        {!collapsed && (
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-mint-400 px-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Command Center</span>
          </span>
        )}
        <button
          onClick={() => {
            playCyberClick();
            setCollapsed(!collapsed);
          }}
          className="p-1.5 rounded-lg bg-forest-950/80 border border-emerald-500/20 text-slate-300 hover:text-white hover:border-emerald-400/50 transition-colors mx-auto"
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
      <div className="p-3 border-t border-emerald-500/20 bg-forest-950/80">
        {!collapsed ? (
          <div className="text-[10px] text-slate-300 flex items-center justify-between font-mono">
            <span>AirGuard AI v2.5</span>
            <span className="text-mint-400 font-bold">111 CAAQMS</span>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mx-auto" />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
