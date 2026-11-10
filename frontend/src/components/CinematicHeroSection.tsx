import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Wind,
  Layers,
  Compass,
  Cpu,
  TrendingDown,
  Globe,
  Radio,
  Zap
} from 'lucide-react';
import { CityDigitalTwin3D } from './CityDigitalTwin3D';
import { AnimatedCounter } from './AnimatedCounter';
import { playCyberClick } from '../utils/audioSystem';

interface CinematicHeroSectionProps {
  selectedCity: string;
  overallAqi: number;
  overallCategory: string;
  stationCount: number;
  pm25?: number;
  pm10?: number;
  temperature?: number;
  windSpeed?: number;
  onExploreDashboard: () => void;
  onPredictFuture: () => void;
}

export const CinematicHeroSection: React.FC<CinematicHeroSectionProps> = ({
  selectedCity,
  overallAqi,
  overallCategory,
  stationCount,
  pm25 = 74,
  pm10 = 128,
  temperature = 28.5,
  windSpeed = 8.2,
  onExploreDashboard,
  onPredictFuture,
}) => {
  const [cityViewActive, setCityViewActive] = useState<boolean>(true);

  const getAqiColor = (val: number) => {
    if (val <= 50) return { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/15', glow: 'shadow-glow-emerald' };
    if (val <= 100) return { text: 'text-lime-400', border: 'border-lime-500/40', bg: 'bg-lime-500/15', glow: 'shadow-glow-emerald' };
    if (val <= 200) return { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/15', glow: 'shadow-glow-orange' };
    if (val <= 300) return { text: 'text-orange-400', border: 'border-orange-500/40', bg: 'bg-orange-500/15', glow: 'shadow-glow-orange' };
    if (val <= 400) return { text: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-500/15', glow: 'shadow-glow-red' };
    return { text: 'text-red-500', border: 'border-red-600/40', bg: 'bg-red-900/30', glow: 'shadow-glow-red' };
  };

  const aqiStyle = getAqiColor(overallAqi);

  return (
    <section className="relative w-full rounded-3xl overflow-hidden glass-panel border border-cyan-500/25 shadow-2xl p-6 sm:p-8 lg:p-10 mb-8">
      {/* Background radial gradient layers */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(11,22,37,0)_0%,rgba(7,17,31,0.85)_100%)] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Heading, Subtitle, Key Stats & CTAs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Futuristic Live Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wider uppercase shadow-glow-cyan backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span>Smart City Environmental Intelligence</span>
            <span className="text-slate-500 font-mono">|</span>
            <span className="text-cyan-400 font-bold">{selectedCity === 'All' ? 'India National' : selectedCity}</span>
          </div>

          {/* Main Heading & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight uppercase">
              <span className="block text-white">INTELLIGENCE FOR A</span>
              <span className="gradient-text-cyan drop-shadow-sm">CLEANER TOMORROW</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Predicting pollution. Understanding our cities. Building a healthier future through artificial intelligence.
            </p>
          </div>

          {/* Floating AQI Badge + Live Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <div className={`p-3.5 rounded-2xl border ${aqiStyle.border} ${aqiStyle.bg} backdrop-blur-md flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live AQI</span>
                <Radio className={`w-3.5 h-3.5 ${aqiStyle.text} animate-pulse`} />
              </div>
              <div className="mt-1">
                <span className={`text-2xl sm:text-3xl font-extrabold ${aqiStyle.text}`}>
                  <AnimatedCounter value={overallAqi} />
                </span>
                <span className="text-[10px] block font-semibold text-slate-300 truncate">
                  {overallCategory}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-700/60 bg-slate-900/50 backdrop-blur-md flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">PM2.5</span>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">
                  <AnimatedCounter value={pm25} decimals={1} />
                </span>
                <span className="text-[10px] block text-slate-400 font-mono">µg/m³</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-700/60 bg-slate-900/50 backdrop-blur-md flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stations</span>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">
                  <AnimatedCounter value={stationCount || 111} />
                </span>
                <span className="text-[10px] block text-cyan-400 font-semibold">CAAQMS Live</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-700/60 bg-slate-900/50 backdrop-blur-md flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ML Accuracy</span>
              <div className="mt-1">
                <span className="text-2xl font-bold text-emerald-400">94.2%</span>
                <span className="text-[10px] block text-slate-400 font-mono">R² 0.94</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: 1. Explore Live Dashboard, 2. Predict Future Pollution */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                playCyberClick();
                onExploreDashboard();
              }}
              className="btn-cinematic-cyan px-6 py-3.5 rounded-2xl flex items-center gap-2.5 text-sm font-bold shadow-glow-cyan group"
            >
              <Activity className="w-4 h-4 stroke-[2.5]" />
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                playCyberClick();
                onPredictFuture();
              }}
              className="btn-cinematic-glass px-6 py-3.5 rounded-2xl flex items-center gap-2.5 text-sm font-semibold hover:text-cyan-300 group"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Predict Future Pollution</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CPCB Statutory Breakpoints</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Open-Meteo Reanalysis</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Smart City Digital Twin */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-slate-950/90">
            {/* 3D City Visualization Component */}
            <CityDigitalTwin3D
              cityName={selectedCity === 'All' ? 'National Digital Twin' : `${selectedCity} Twin`}
              aqi={overallAqi}
              category={overallCategory}
              pm25={pm25}
              pm10={pm10}
              windSpeed={windSpeed}
              temperature={temperature}
              height="440px"
            />

            {/* Quick interactive overlay badge */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-[11px] text-cyan-300 font-mono">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>Drag to Orbit • Scroll to Zoom</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CinematicHeroSection;

