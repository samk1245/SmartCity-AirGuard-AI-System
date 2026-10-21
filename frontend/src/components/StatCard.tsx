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
  glowColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  badge,
  trend,
  accentColor = 'text-cyan-400',
  glowColor = 'cyan',
}) => {
  return (
    <ThreeDCard glowColor={glowColor} tiltStrength={10} depth={15} className="h-full">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {title}
            </span>
            <div className={`p-2 rounded-xl bg-slate-950/80 border border-slate-800 ${accentColor} shadow-inner`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-black text-white tracking-tight drop-shadow-sm">
              {value}
            </span>
            {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-xs">
          {subtitle && <span className="text-slate-400 truncate max-w-[180px] font-medium">{subtitle}</span>}
          {badge}
          {trend && (
            <span
              className={`font-bold flex items-center gap-1 ${
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
