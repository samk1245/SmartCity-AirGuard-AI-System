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
  size = 280,
}) => {
  // Clamp AQI between 0 and 500 for the 180-degree gauge (-90deg to +90deg)
  const clampedAqi = Math.max(0, Math.min(500, aqi));
  const angle = (clampedAqi / 500) * 180 - 90;

  const styles = getCategoryStyles(category);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Background ambient radial glow centered on gauge hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <svg
        width={size}
        height={size * 0.64}
        viewBox="0 0 280 176"
        className="overflow-visible relative z-10"
      >
        <defs>
          {/* Gradients for CPCB gauge segments */}
          <linearGradient id="gaugeGood" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="gaugeSat" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#84CC16" />
          </linearGradient>
          <linearGradient id="gaugeMod" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="gaugePoor" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="gaugeVPoor" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="gaugeSev" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Glowing filter */}
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#10B981" floodOpacity="0.35" />
          </filter>

          {/* Needle shadow filter */}
          <filter id="needleGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* Outer subtle guide track with tick marks */}
        <path
          d="M 20 150 A 120 120 0 0 1 260 150"
          fill="none"
          stroke="rgba(52, 211, 153, 0.2)"
          strokeWidth="2"
          strokeDasharray="4 6"
        />

        {/* Outer Atmospheric Aura Arc */}
        <path
          d="M 25 150 A 115 115 0 0 1 255 150"
          fill="none"
          stroke="rgba(16, 185, 129, 0.08)"
          strokeWidth="32"
          strokeLinecap="round"
          className="animate-pulse"
        />

        {/* Outer Background Arc */}
        <path
          d="M 25 150 A 115 115 0 0 1 255 150"
          fill="none"
          stroke="rgba(4, 18, 11, 0.95)"
          strokeWidth="22"
          strokeLinecap="round"
        />

        {/* 6 Colored CPCB Segments */}
        {/* 1. Good: 0 - 50 (18 deg) */}
        <path
          d="M 25 150 A 115 115 0 0 1 35.8 114.5"
          fill="none"
          stroke="url(#gaugeGood)"
          strokeWidth="19"
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        {/* 2. Satisfactory: 51 - 100 (18 deg) */}
        <path
          d="M 37 110.8 A 115 115 0 0 1 65.5 73.5"
          fill="none"
          stroke="url(#gaugeSat)"
          strokeWidth="19"
          className="transition-all duration-500"
        />
        {/* 3. Moderate: 101 - 200 (36 deg) */}
        <path
          d="M 68 70.8 A 115 115 0 0 1 138 35"
          fill="none"
          stroke="url(#gaugeMod)"
          strokeWidth="19"
          className="transition-all duration-500"
        />
        {/* 4. Poor: 201 - 300 (36 deg) */}
        <path
          d="M 142 35 A 115 115 0 0 1 212 70.8"
          fill="none"
          stroke="url(#gaugePoor)"
          strokeWidth="19"
          className="transition-all duration-500"
        />
        {/* 5. Very Poor: 301 - 400 (36 deg) */}
        <path
          d="M 214.5 73.5 A 115 115 0 0 1 243 110.8"
          fill="none"
          stroke="url(#gaugeVPoor)"
          strokeWidth="19"
          className="transition-all duration-500"
        />
        {/* 6. Severe: 401 - 500 (36 deg) */}
        <path
          d="M 244.2 114.5 A 115 115 0 0 1 255 150"
          fill="none"
          stroke="url(#gaugeSev)"
          strokeWidth="19"
          strokeLinecap="round"
          className="transition-all duration-500"
        />

        {/* Scale labels */}
        <text x="25" y="167" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="monospace">0</text>
        <text x="56" y="70" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">100</text>
        <text x="131" y="24" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">200</text>
        <text x="212" y="70" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">300</text>
        <text x="245" y="167" fill="#64748b" fontSize="10" fontWeight="bold" fontFamily="monospace">500+</text>

        {/* Animated 3D Needle */}
        <g
          transform={`rotate(${angle} 140 150)`}
          style={{ transition: 'transform 1.25s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          filter="url(#needleGlow)"
        >
          {/* Needle body */}
          <polygon
            points="137.5,150 142.5,150 141,45 139,45"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          {/* Needle glowing tip */}
          <polygon points="140,43 142.5,50 137.5,50" fill="#10B981" />
        </g>

        {/* Center Spatial Glass Chrome Hub */}
        <circle cx="140" cy="150" r="16" fill="#04120b" stroke="rgba(16,185,129,0.4)" strokeWidth="2.5" />
        <circle cx="140" cy="150" r="10" fill="#10B981" opacity="0.85" />
        <circle cx="140" cy="150" r="4.5" fill="#ffffff" />
      </svg>

      {/* Numerical read-out & Category Pill */}
      <div className="-mt-8 text-center relative z-20">
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md font-sans">
            {Math.round(aqi)}
          </span>
          <span className="text-xs text-mint-400 font-bold uppercase font-mono tracking-wider">AQI</span>
        </div>
        <div className="mt-1.5">
          <span
            className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border shadow-glass backdrop-blur-md ${styles.bg}`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 animate-ping ${styles.dot}`} />
            {category}
          </span>
        </div>
      </div>
    </div>
  );
};
