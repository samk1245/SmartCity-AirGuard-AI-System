import React from 'react';

export type Icon3DType =
  | 'wind'
  | 'leaf'
  | 'alert'
  | 'factory'
  | 'ai'
  | 'cloud'
  | 'thermometer'
  | 'lungs'
  | 'mask'
  | 'runner'
  | 'home'
  | 'chart'
  | 'shield';

interface ThreeDIconProps {
  name: Icon3DType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ThreeDIcon: React.FC<ThreeDIconProps> = ({
  name,
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  }[size];

  const renderIcon = () => {
    switch (name) {
      case 'wind':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_12px_rgba(6,182,212,0.4)]">
            <defs>
              <linearGradient id="windG1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="windG2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a5f3fc" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <filter id="shadow3d">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.35" />
              </filter>
            </defs>
            <circle cx="32" cy="32" r="28" fill="url(#windG1)" opacity="0.15" />
            <path
              d="M10 22h32a8 8 0 1 0-8-8"
              fill="none"
              stroke="url(#windG2)"
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#shadow3d)"
            />
            <path
              d="M6 34h44a6 6 0 1 1-6 6"
              fill="none"
              stroke="url(#windG1)"
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#shadow3d)"
            />
            <path
              d="M14 44h24a5 5 0 1 0-5-5"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="4.5"
              strokeLinecap="round"
              filter="url(#shadow3d)"
            />
          </svg>
        );

      case 'leaf':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_12px_rgba(16,185,129,0.4)]">
            <defs>
              <linearGradient id="leafG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="60%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="leafGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M12 52C14 36 28 14 54 10C56 36 34 52 12 52Z"
              fill="url(#leafG)"
              stroke="#059669"
              strokeWidth="1.5"
            />
            <path
              d="M14 50C26 36 38 24 54 10"
              stroke="#ecfdf5"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M26 36C32 30 38 32 44 26"
              stroke="#a7f3d0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ellipse cx="32" cy="24" rx="10" ry="5" fill="url(#leafGloss)" transform="rotate(-30 32 24)" />
          </svg>
        );

      case 'alert':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_14px_rgba(244,63,94,0.45)]">
            <defs>
              <linearGradient id="alertG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="60%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>
            <polygon
              points="32,6 58,52 6,52"
              fill="url(#alertG)"
              stroke="#e11d48"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon points="32,10 54,49 10,49" fill="#881337" opacity="0.25" />
            <rect x="29" y="22" width="6" height="14" rx="3" fill="#ffffff" />
            <circle cx="32" cy="42" r="3.5" fill="#ffffff" />
          </svg>
        );

      case 'ai':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_14px_rgba(168,85,247,0.4)]">
            <defs>
              <linearGradient id="aiG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>
              <linearGradient id="coreG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <rect x="12" y="12" width="40" height="40" rx="10" fill="url(#aiG)" stroke="#9333ea" strokeWidth="2" />
            <rect x="20" y="20" width="24" height="24" rx="6" fill="url(#coreG)" />
            {/* Chip pins */}
            <line x1="22" y1="4" x2="22" y2="12" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="32" y1="4" x2="32" y2="12" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="42" y1="4" x2="42" y2="12" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="22" y1="52" x2="22" y2="60" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="32" y1="52" x2="32" y2="60" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="42" y1="52" x2="42" y2="60" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="4" y1="22" x2="12" y2="22" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="4" y1="32" x2="12" y2="32" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="4" y1="42" x2="12" y2="42" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="52" y1="22" x2="60" y2="22" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="52" y1="32" x2="60" y2="32" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="52" y1="42" x2="60" y2="42" stroke="#d8b4fe" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="32" r="5" fill="#ffffff" />
          </svg>
        );

      case 'lungs':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_12px_rgba(244,63,94,0.35)]">
            <defs>
              <linearGradient id="lungsG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
            {/* Trachea */}
            <path d="M32 10v16M28 20l-8 10M36 20l8 10" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            {/* Left Lung */}
            <path
              d="M18 28C10 32 8 46 14 52C20 56 26 50 26 38C26 32 24 28 18 28Z"
              fill="url(#lungsG)"
              stroke="#fda4af"
              strokeWidth="1.5"
            />
            {/* Right Lung */}
            <path
              d="M46 28C54 32 56 46 50 52C44 56 38 50 38 38C38 32 40 28 46 28Z"
              fill="url(#lungsG)"
              stroke="#fda4af"
              strokeWidth="1.5"
            />
          </svg>
        );

      case 'mask':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_12px_rgba(56,189,248,0.35)]">
            <defs>
              <linearGradient id="maskG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="50%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#7dd3fc" />
              </linearGradient>
            </defs>
            {/* Straps */}
            <path d="M12 28C4 28 4 40 12 40" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M52 28C60 28 60 40 52 40" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Mask Body */}
            <path
              d="M12 28L32 20L52 28C52 42 42 52 32 54C22 52 12 42 12 28Z"
              fill="url(#maskG)"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            {/* Valve */}
            <circle cx="32" cy="36" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        );

      case 'runner':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_12px_rgba(245,158,11,0.35)]">
            <defs>
              <linearGradient id="runnerG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <circle cx="42" cy="14" r="6" fill="url(#runnerG)" />
            <path
              d="M36 24L26 34L14 30M26 34L34 42L44 40M34 42L28 54"
              stroke="url(#runnerG)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        );

      case 'home':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_12px_rgba(99,102,241,0.35)]">
            <defs>
              <linearGradient id="roofG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <linearGradient id="wallG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#c7d2fe" />
              </linearGradient>
            </defs>
            <polygon points="32,10 54,28 10,28" fill="url(#roofG)" />
            <rect x="16" y="28" width="32" height="24" rx="2" fill="url(#wallG)" />
            <rect x="26" y="36" width="12" height="16" rx="2" fill="#4338ca" />
            <circle cx="28" cy="44" r="1.5" fill="#fef08a" />
          </svg>
        );

      case 'cloud':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_12px_rgba(56,189,248,0.35)]">
            <defs>
              <linearGradient id="cloudG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="60%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>
            <path
              d="M20 44H46A14 14 0 0 0 46 16A18 18 0 0 0 16 26A10 10 0 0 0 20 44Z"
              fill="url(#cloudG)"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            {/* Droplets */}
            <path d="M22 48L18 56M32 48L28 56M42 48L38 56" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'thermometer':
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_12px_rgba(239,68,68,0.35)]">
            <defs>
              <linearGradient id="thermoG" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            <rect x="27" y="10" width="10" height="34" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <circle cx="32" cy="46" r="10" fill="url(#thermoG)" stroke="#64748b" strokeWidth="2" />
            <rect x="29" y="24" width="6" height="20" rx="3" fill="url(#thermoG)" />
          </svg>
        );

      case 'chart':
      default:
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_8px_12px_rgba(6,182,212,0.35)]">
            <defs>
              <linearGradient id="bar1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="bar2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="bar3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>
            <rect x="12" y="32" width="10" height="22" rx="3" fill="url(#bar1)" />
            <rect x="27" y="20" width="10" height="34" rx="3" fill="url(#bar2)" />
            <rect x="42" y="12" width="10" height="42" rx="3" fill="url(#bar3)" />
            <line x1="8" y1="56" x2="56" y2="56" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return <div className={`inline-flex items-center justify-center ${sizeMap} ${className}`}>{renderIcon()}</div>;
};
