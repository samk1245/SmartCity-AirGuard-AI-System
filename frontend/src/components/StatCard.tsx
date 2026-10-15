import React from 'react';
import { LucideIcon } from 'lucide-react';

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
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  badge,
  trend,
  accentColor = 'text-cyan-400'
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg backdrop-blur-sm hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-lg bg-slate-900/60 ${accentColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/40 text-xs">
        {subtitle && <span className="text-slate-400 truncate max-w-[180px]">{subtitle}</span>}
        {badge}
        {trend && (
          <span
            className={`font-semibold flex items-center gap-1 ${
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
  );
};
