import {
  LayoutDashboard,
  Globe,
  Compass,
  Activity,
  LineChart,
  Sparkles,
  MapPin,
  AlertTriangle,
  UploadCloud,
  Cpu,
  Settings,
  Info
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'earth3d'
  | 'streetview'
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

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  unreadAlertsCount
}) => {
  const menuItems = [
    { id: 'dashboard' as NavTab, label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'earth3d' as NavTab, label: '3D Earth & Atmosphere', icon: Globe, badge: '3D', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' },
    { id: 'streetview' as NavTab, label: 'Street View Explorer', icon: Compass, badge: '360°', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
    { id: 'live' as NavTab, label: 'Live Station Quality', icon: Activity },
    { id: 'historical' as NavTab, label: 'Historical Analytics', icon: LineChart },
    { id: 'forecast' as NavTab, label: 'AI Pollution Forecast', icon: Sparkles, badge: 'ML' },
    { id: 'map' as NavTab, label: 'Interactive Pollution Map', icon: MapPin },
    {
      id: 'alerts' as NavTab,
      label: 'Alerts & Health Risks',
      icon: AlertTriangle,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount.toString() : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'upload' as NavTab, label: 'Dataset Upload & Ingest', icon: UploadCloud },
    { id: 'model' as NavTab, label: 'ML Performance & Train', icon: Cpu },
    { id: 'settings' as NavTab, label: 'Configuration & APIs', icon: Settings },
    { id: 'about' as NavTab, label: 'Methodology & Standards', icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 min-h-[calc(100vh-65px)]">
      <nav className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Attribution footer */}
      <div className="pt-4 border-t border-slate-800/80 px-3 text-xs text-slate-500">
        <p className="font-semibold text-slate-400">CPCB NAQI Compliant</p>
        <p className="text-[11px] mt-0.5">Indian Urban Atmospheric Intelligence</p>
      </div>
    </aside>
  );
};
