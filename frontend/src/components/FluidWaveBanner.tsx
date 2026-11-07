import React, { useState, useEffect } from 'react';
import { Droplets, Wind, Sparkles, Shield, Compass, Plane, Clock, Activity, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface FluidWaveBannerProps {
  selectedCity: string;
  stationCount: number;
  overallAqi: number;
  onNavigate: (tab: any) => void;
  onOpenExposureModal: () => void;
}

export const FluidWaveBanner: React.FC<FluidWaveBannerProps> = ({
  selectedCity,
  stationCount,
  overallAqi,
  onNavigate,
  onOpenExposureModal,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border border-cyan-500/30 p-6 sm:p-7 shadow-2xl">
      {/* Background Animated Watery Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg
          className="absolute -bottom-10 left-0 w-[200%] h-36 text-cyan-500 animate-water-wave-fast"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,50 L1200,120 L0,120 Z" />
        </svg>
        <svg
          className="absolute -bottom-6 left-0 w-[200%] h-32 text-teal-400 animate-water-wave-slow opacity-60"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,30 C300,100 600,0 900,60 C1050,90 1150,40 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Radiant ambient glow orbs */}
      <div className="absolute -top-12 -right-12 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          {/* Top Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>LIVE TELEMETRY</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{timeStr || 'IST'}</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-medium text-emerald-300 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              <span>48 Indian Municipal Centers • 111 CAAQMS Stations</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Environmental Intelligence Nexus</span>
            <span className="text-sm font-semibold px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hidden sm:inline-block">
              v2.5 Pro
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time urban air guard monitoring, 3D Gaussian plume physics, planetary boundary layer telemetry, and fluid wave atmospheric dispersion across India.
          </p>

          {/* Quick Stats Pill Line */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-semibold">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Active Scope: <strong className="text-white">{selectedCity === 'All' ? 'Pan-India Network' : selectedCity}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <Wind className="w-4 h-4 text-teal-400" />
              <span>Nodes: <strong className="text-white">{stationCount} CPCB Sensors</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Overall AQI: <strong className="text-white">{overallAqi}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Button Strip with Shimmering Liquid Glass Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 lg:flex-col lg:items-end">
          <button
            onClick={() => onNavigate('ecoshield')}
            className="btn-liquid-cyan px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2"
          >
            <Droplets className="w-4 h-4 text-slate-950" />
            <span>Eco-Shield & Fluid Wave</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </button>

          <button
            onClick={() => onNavigate('travel')}
            className="btn-liquid-purple px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2"
          >
            <Plane className="w-4 h-4 text-white" />
            <span>Travel Air Guard</span>
          </button>

          <button
            onClick={() => onNavigate('plume')}
            className="btn-glass-tactile px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2"
          >
            <Wind className="w-4 h-4 text-cyan-400" />
            <span>3D Plume Simulator</span>
          </button>

          <button
            onClick={onOpenExposureModal}
            className="btn-liquid-rose px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-white" />
            <span>Personal Inhaled Dose</span>
          </button>
        </div>
      </div>
    </div>
  );
};
