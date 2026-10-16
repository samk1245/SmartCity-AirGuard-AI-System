import React from 'react';
import { getCategoryStyles } from './AQIBadge';

interface AQIGaugeProps {
  aqi: number;
  category: string;
  size?: number;
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({
  aqi,
  category,
  size = 280
}) => {
  // Clamp AQI between 0 and 500 for the 180-degree gauge (-90deg to +90deg)
  const clampedAqi = Math.max(0, Math.min(500, aqi));
  const angle = (clampedAqi / 500) * 180 - 90;

  const styles = getCategoryStyles(category);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg
        width={size}
        height={size * 0.62}
        viewBox="0 0 280 170"
        className="overflow-visible"
      >
        <defs>
          {/* Gradients for gauge segments */}
          <linearGradient id="gaugeGood" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="gaugeSat" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#a3e635" />
          </linearGradient>
          <linearGradient id="gaugeMod" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="gaugePoor" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <linearGradient id="gaugeVPoor" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
          <linearGradient id="gaugeSev" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          {/* Needle shadow filter */}
          <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Outer Background Arc */}
        <path
          d="M 25 150 A 115 115 0 0 1 255 150"
          fill="none"
          stroke="#1e293b"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {/* 6 Colored CPCB Segments */}
        {/* 1. Good: 0 - 50 (18 deg) */}
        <path
          d="M 25 150 A 115 115 0 0 1 35.8 114.5"
          fill="none"
          stroke="url(#gaugeGood)"
          strokeWidth="20"
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        {/* 2. Satisfactory: 51 - 100 (18 deg) */}
        <path
          d="M 37 110.8 A 115 115 0 0 1 65.5 73.5"
          fill="none"
          stroke="url(#gaugeSat)"
          strokeWidth="20"
          className="transition-all duration-500"
        />
        {/* 3. Moderate: 101 - 200 (36 deg) */}
        <path
          d="M 68 70.8 A 115 115 0 0 1 138 35"
          fill="none"
          stroke="url(#gaugeMod)"
          strokeWidth="20"
          className="transition-all duration-500"
        />
        {/* 4. Poor: 201 - 300 (36 deg) */}
        <path
          d="M 142 35 A 115 115 0 0 1 212 70.8"
          fill="none"
          stroke="url(#gaugePoor)"
          strokeWidth="20"
          className="transition-all duration-500"
        />
        {/* 5. Very Poor: 301 - 400 (36 deg) */}
        <path
          d="M 214.5 73.5 A 115 115 0 0 1 243 110.8"
          fill="none"
          stroke="url(#gaugeVPoor)"
          strokeWidth="20"
          className="transition-all duration-500"
        />
        {/* 6. Severe: 401 - 500 (36 deg) */}
        <path
          d="M 244.2 114.5 A 115 115 0 0 1 255 150"
          fill="none"
          stroke="url(#gaugeSev)"
          strokeWidth="20"
          strokeLinecap="round"
          className="transition-all duration-500"
        />

        {/* Scale labels */}
        <text x="25" y="165" fill="#64748b" fontSize="10" fontWeight="bold">0</text>
        <text x="58" y="70" fill="#64748b" fontSize="9" fontWeight="bold">100</text>
        <text x="133" y="26" fill="#64748b" fontSize="9" fontWeight="bold">200</text>
        <text x="210" y="70" fill="#64748b" fontSize="9" fontWeight="bold">300</text>
        <text x="245" y="165" fill="#64748b" fontSize="10" fontWeight="bold">500+</text>

        {/* Animated 3D Needle */}
        <g
          transform={`rotate(${angle} 140 150)`}
          style={{ transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          filter="url(#needleGlow)"
        >
          {/* Needle body */}
          <polygon
            points="137,150 143,150 141,45 139,45"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          <polygon points="140,45 142,50 138,50" fill="#06b6d4" />
        </g>

        {/* Center 3D Chrome Cap */}
        <circle cx="140" cy="150" r="14" fill="#0f172a" stroke="#334155" strokeWidth="3" />
        <circle cx="140" cy="150" r="9" fill="#38bdf8" opacity="0.9" />
        <circle cx="140" cy="150" r="4" fill="#ffffff" />
      </svg>

      {/* Numerical read-out & Category Pill */}
      <div className="-mt-7 text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-black text-white tracking-tight drop-shadow-md">
            {Math.round(aqi)}
          </span>
          <span className="text-xs text-slate-400 font-semibold uppercase">AQI</span>
        </div>
        <div className="mt-1">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-lg ${styles.bg}`}
          >
            <span className={`w-2 h-2 rounded-full mr-1.5 animate-pulse ${styles.dot}`} />
            {category}
          </span>
        </div>
      </div>
    </div>
  );
};
