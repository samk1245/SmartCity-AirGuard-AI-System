import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ThreeDCard } from './ThreeDCard';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    text: string;
  };
  accentColor?: string;
  glowColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple' | 'mint';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  badge,
  trend,
  accentColor = 'text-mint-400',
  glowColor = 'emerald',
}) => {
  return (
    <ThreeDCard glowColor={glowColor} tiltStrength={10} depth={18} className="h-full">
      <div className="glass-card rounded-2xl p-5 shadow-glass flex flex-col justify-between h-full border border-emerald-500/20 hover:border-emerald-400/40 relative overflow-hidden group">
        {/* Subtle top edge specular highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
              {title}
            </span>
            <div className={`p-2.5 rounded-xl bg-forest-950/80 border border-emerald-500/25 ${accentColor} shadow-inner transition-transform duration-300 group-hover:scale-110`}>
              <Icon className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-black text-white tracking-tight drop-shadow-sm font-sans">
              {value}
            </span>
            {unit && <span className="text-xs font-semibold text-mint-300/80 font-mono">{unit}</span>}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-emerald-500/15 text-xs">
          {subtitle && <span className="text-slate-300 truncate max-w-[180px] font-medium">{subtitle}</span>}
          {badge}
          {trend && (
            <span
              className={`font-bold flex items-center gap-1 font-mono text-[11px] ${
                trend.direction === 'down'
                  ? 'text-emerald-400'
                  : trend.direction === 'up'
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '—'}{' '}
              {trend.text}
            </span>
          )}
        </div>
      </div>
    </ThreeDCard>
  );
};
