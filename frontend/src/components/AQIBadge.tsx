import React from 'react';

interface AQIBadgeProps {
  category: string;
  aqi?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const getCategoryStyles = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'good':
      return {
        bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        dot: 'bg-emerald-400',
        label: 'Good (0-50)'
      };
    case 'satisfactory':
      return {
        bg: 'bg-lime-500/20 text-lime-400 border-lime-500/40',
        dot: 'bg-lime-400',
        label: 'Satisfactory (51-100)'
      };
    case 'moderate':
      return {
        bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        dot: 'bg-amber-400',
        label: 'Moderate (101-200)'
      };
    case 'poor':
      return {
        bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
        dot: 'bg-orange-400',
        label: 'Poor (201-300)'
      };
    case 'very poor':
      return {
        bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        dot: 'bg-rose-400',
        label: 'Very Poor (301-400)'
      };
    case 'severe':
      return {
        bg: 'bg-red-900/30 text-red-400 border-red-700/50',
        dot: 'bg-red-500',
        label: 'Severe (401-500+)'
      };
    default:
      return {
        bg: 'bg-slate-700/30 text-slate-400 border-slate-600',
        dot: 'bg-slate-400',
        label: 'Unknown'
      };
  }
};

export const AQIBadge: React.FC<AQIBadgeProps> = ({
  category,
  aqi,
  size = 'md',
  showNumber = true
}) => {
  const styles = getCategoryStyles(category);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-1 gap-2',
    lg: 'text-base px-3.5 py-1.5 gap-2.5 font-semibold'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${styles.bg} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full animate-pulse ${styles.dot}`} />
      <span>{category}</span>
      {showNumber && aqi !== undefined && (
        <span className="font-bold border-l pl-2 border-current/30">
          {Math.round(aqi)}
        </span>
      )}
    </span>
  );
};
