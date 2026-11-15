import React from 'react';

/**
 * Premium AI Environmental Radar Scanner
 * Rotating scanning rings, animated radar line, green scanning beams & atmospheric particles
 */
export const EnvironmentalScannerLoader: React.FC<{ message?: string }> = ({
  message = 'SYNTHESIZING ATMOSPHERIC TELEMETRY...',
}) => (
  <div className="flex flex-col items-center justify-center p-12 relative select-none">
    {/* Concentric Radar Rings & Scanner Container */}
    <div className="relative w-44 h-44 flex items-center justify-center">
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />

      {/* Ring 1: Outermost dashed ring */}
      <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30 animate-[spin_25s_linear_infinite]" />

      {/* Ring 2: Middle precision coordinate ring */}
      <div className="absolute inset-4 rounded-full border border-emerald-400/25 animate-[spin_15s_linear_infinite_reverse]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-mint-400 shadow-glow-mint" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow-emerald" />
      </div>

      {/* Ring 3: Inner solid ring */}
      <div className="absolute inset-8 rounded-full border border-emerald-500/40" />

      {/* Ring 4: Core ring */}
      <div className="absolute inset-14 rounded-full border border-pista-300/30 bg-forest-950/80 backdrop-blur-md flex items-center justify-center shadow-inner">
        <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-mint-300 shadow-glow-mint" />
      </div>

      {/* Rotating 360 Radar Sweep Beam */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none animate-[spin_4s_linear_infinite]">
        <div className="w-1/2 h-1/2 absolute top-0 right-0 origin-bottom-left bg-gradient-to-tr from-transparent via-emerald-500/15 to-mint-400/40 rounded-tr-full" />
        <div className="absolute top-0 left-1/2 h-1/2 w-0.5 bg-gradient-to-t from-emerald-400 via-mint-300 to-transparent shadow-[0_0_10px_#34d399]" />
      </div>

      {/* Crosshair telemetry lines */}
      <div className="absolute w-full h-[1px] bg-emerald-500/20" />
      <div className="absolute h-full w-[1px] bg-emerald-500/20" />
    </div>

    {/* Status indicator */}
    <div className="mt-6 flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-mint-400 uppercase">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>{message}</span>
      </div>
      <span className="text-[10px] text-slate-400 font-mono tracking-wider">
        CENTRAL POLLUTION CONTROL BOARD • CAAQMS REAL-TIME SENSING
      </span>
    </div>
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="glass-card relative overflow-hidden rounded-2xl p-5 border border-emerald-500/20 shadow-glass">
    {/* Subtle specular sweep */}
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent animate-sheen pointer-events-none" />

    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-emerald-950/60 border border-emerald-500/20 rounded-md w-1/3 animate-pulse" />
      <div className="h-8 w-8 bg-emerald-950/80 border border-emerald-500/30 rounded-xl" />
    </div>
    <div className="h-8 bg-emerald-900/40 border border-emerald-500/20 rounded-lg w-1/2 mb-3 animate-pulse" />
    <div className="h-3 bg-emerald-950/40 rounded w-2/3" />
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="glass-panel relative overflow-hidden rounded-3xl p-6 lg:p-8 border border-emerald-500/25 shadow-spatial-glass">
    {/* Header bar */}
    <div className="flex justify-between items-center mb-6">
      <div className="h-5 bg-emerald-950/60 border border-emerald-500/20 rounded-md w-1/4 animate-pulse" />
      <div className="h-6 w-24 bg-emerald-950/80 border border-emerald-500/30 rounded-full" />
    </div>

    {/* Bar chart skeleton with animated vertical glow */}
    <div className="h-64 bg-forest-950/70 border border-emerald-500/15 rounded-2xl flex items-end p-4 gap-2.5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="bg-gradient-to-t from-emerald-900/60 to-emerald-500/30 border-t border-emerald-400/40 rounded-t flex-1 transition-all duration-700 animate-pulse"
          style={{
            height: `${25 + ((i * 7) % 65)}%`,
            animationDelay: `${i * 60}ms`,
          }}
        />
      ))}
    </div>
  </div>
);
