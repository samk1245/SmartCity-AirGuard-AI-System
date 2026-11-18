import React, { useState } from 'react';
import {
  Sparkles,
  Terminal,
  ArrowRight,
  Check,
  CheckCircle2,
  Zap,
  Flame,
  Shield,
  Activity,
  Globe,
  Cpu,
  Star,
  Copy,
  ChevronRight,
  Command,
  Code2,
  Heart,
  Droplets,
  Layers,
  Wind,
  Compass,
  Sliders,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';

interface LandingShowcasePageProps {
  onNavigateToApp?: (tab: string) => void;
}

export const LandingShowcasePage: React.FC<LandingShowcasePageProps> = ({
  onNavigateToApp,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [copiedTerminal, setCopiedTerminal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'cloud' | 'neural' | 'edge'>('cloud');
  const [magicButtonPushed, setMagicButtonPushed] = useState<boolean>(false);

  const terminalCommand = 'npx airguard-ai@latest init --planetary-scale --telemetry=cpcb';

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(terminalCommand);
    setCopiedTerminal(true);
    setTimeout(() => setCopiedTerminal(false), 2000);
  };

  const handleMagicClick = () => {
    setMagicButtonPushed(true);
    setTimeout(() => setMagicButtonPushed(false), 2500);
  };

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden font-sans selection:bg-fuchsia-500 selection:text-white">
      {/* =================================================================== */}
      {/* 1. BACKGROUND CANVAS: Pure White, Dot Grid & Radial Glow Orbs       */}
      {/* =================================================================== */}
      <div className="absolute inset-0 bg-white pointer-events-none" />

      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-[0.16] pointer-events-none" />

      {/* Massive Neon Radial Orbs (Purple, Pink, Cyan) */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-purple-600/35 via-fuchsia-500/25 to-pink-500/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[600px] -left-48 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/30 via-indigo-500/25 to-purple-600/30 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[1400px] -right-48 w-[600px] h-[600px] bg-gradient-to-bl from-pink-500/30 via-purple-600/25 to-amber-400/25 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-24">
        {/* =================================================================== */}
        {/* 2. TOP HERO ANNOUNCEMENT PILL                                      */}
        {/* =================================================================== */}
        <div className="flex flex-col items-center text-center space-y-7 pt-6">
          {/* Rainbow glowing badge with Sparkle icon */}
          <div className="inline-flex items-center gap-2 p-[2px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 shadow-[0_10px_25px_rgba(168,85,247,0.35)] hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-black tracking-wide text-purple-950 uppercase">
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping" />
              <Sparkles className="w-4 h-4 text-fuchsia-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Announcing AirGuard 3.0 Ultra-SaaS 🦄</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                NEW
              </span>
            </div>
          </div>

          {/* =================================================================== */}
          {/* 3. "IT'S NOT X, IT'S Y" VIRAL HEADLINE                              */}
          {/* =================================================================== */}
          <div className="space-y-4 max-w-4xl">
            <div className="text-xl sm:text-2xl font-bold text-slate-500 tracking-tight line-through decoration-pink-500 decoration-4">
              It’s not just an air quality monitor.
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.08]">
              It’s an <span className="bg-gradient-to-r from-[#ff007a] via-[#7928ca] to-[#0070f3] bg-clip-text text-transparent drop-shadow-sm">existential planetary intelligence</span> engine. 🚀
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed pt-2">
              Transforming messy ambient aerosols into crisp billion-dollar predictive insights with raw compute, harsh gradients, and unhinged neural confidence.
            </p>
          </div>

          {/* CTA Buttons: Harsh Gradient + Animated Arrows */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigateToApp && onNavigateToApp('dashboard')}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-black text-base shadow-[0_20px_45px_rgba(147,51,234,0.45)] hover:shadow-[0_25px_60px_rgba(217,70,239,0.55)] hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>

            <button
              onClick={() => onNavigateToApp && onNavigateToApp('ecoshield')}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-3xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-base border-2 border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-purple-400 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              <span>Explore Eco-Shield Lab</span>
              <Droplets className="w-5 h-5 text-cyan-500" />
            </button>
          </div>

          {/* Pastel Tag Ribbon: Emojis + Pastel Colours */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
            <span className="px-3 py-1 rounded-2xl bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200">
              💜 Zero Latency
            </span>
            <span className="px-3 py-1 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              🌿 48 Indian Metros
            </span>
            <span className="px-3 py-1 rounded-2xl bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200">
              ⚡ 111 CAAQMS Towers
            </span>
            <span className="px-3 py-1 rounded-2xl bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
              🔥 273,000+ Observations
            </span>
            <span className="px-3 py-1 rounded-2xl bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
              ✨ 99.999% Vibes
            </span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 4. MACOS TERMINAL WINDOW (Drop Shadows, Traffic Dots)               */}
        {/* =================================================================== */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-slate-950 border border-slate-800 shadow-[0_30px_70px_rgba(15,23,42,0.45)] overflow-hidden">
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm" />
                <span className="ml-3 text-xs font-mono font-medium text-slate-400">
                  zsh — airguard-ai-daemon — 80×24
                </span>
              </div>
              <button
                onClick={handleCopyCommand}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                title="Copy Terminal Command"
              >
                {copiedTerminal ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-xs sm:text-sm text-slate-200 space-y-2.5 overflow-x-auto">
              <div className="flex items-center gap-2 text-fuchsia-400">
                <span className="text-emerald-400">samir@macbook-pro</span>
                <span className="text-slate-500">:</span>
                <span className="text-cyan-300">~/smart-city-airguard</span>
                <span className="text-slate-400">$</span>
                <span className="text-white font-bold">{terminalCommand}</span>
              </div>
              <div className="text-slate-400 pt-1">
                [info] Initializing quantum atmospheric stream v2.5.0-pro...
              </div>
              <div className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Connected to 111 CPCB CAAQMS nodes across 48 Indian municipal sectors</span>
              </div>
              <div className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Computed Pasquill-Gifford stability class & Planetary Boundary Layer</span>
              </div>
              <div className="text-cyan-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Synthesized 3D Gaussian plume dispersion matrix (0.0018s latency)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 space-y-1">
                <div className="text-purple-400 font-bold">✨ Planetary Status Report:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                  <div>Status: <span className="text-emerald-400 font-bold">ONLINE</span></div>
                  <div>Avg Latency: <span className="text-cyan-400 font-bold">14ms</span></div>
                  <div>Cities: <span className="text-white font-bold">48 Active</span></div>
                  <div>Confidence: <span className="text-fuchsia-400 font-bold">99.8%</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 text-slate-400">
                <span className="text-slate-400">$</span>
                <span className="inline-block w-2.5 h-4 bg-fuchsia-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 5. 3 FEATURE CARDS IN A ROW (Drop Shadows, Soft Radius, Emojis)    */}
        {/* =================================================================== */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              🌈 Pure Engineering Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              3 Disruptive Superpowers in a Single Row
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Constructed with liquid glass, rainbow gradients, and zero excuses.
            </p>
          </div>

          {/* EXACTLY 3 FEATURE CARDS IN A ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: 3D Gaussian Plume */}
            <div className="group relative rounded-3xl p-7 bg-white border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgba(168,85,247,0.22)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  🌪️
                </div>
                <div className="inline-block px-3 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[11px] font-bold">
                  WebGL Fluid Physics
                </div>
                <h3 className="text-xl font-black text-slate-950 tracking-tight">
                  3D Gaussian Plume Dispersion
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Real-time interactive WebGL smoke dispersion simulating industrial stack emissions across Pasquill-Gifford A–F stability classes.
                </p>
                <div className="space-y-2 pt-2 text-xs text-slate-700 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Real-time Stack Height & Wind Speed Sliders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dynamic Cmax & Ground Exposure Profiler</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Industrial CPCB Emission Standard Verification</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => onNavigateToApp && onNavigateToApp('plume')}
                  className="w-full py-3 rounded-2xl bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
                >
                  <span>Launch 3D Plume</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 2: Travel Air Guard */}
            <div className="group relative rounded-3xl p-7 bg-white border-2 border-purple-500 shadow-[0_25px_50px_rgba(147,51,234,0.22)] hover:shadow-[0_35px_70px_rgba(147,51,234,0.35)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                👑 CROWD FAVORITE
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                  ✈️
                </div>
                <div className="inline-block px-3 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-bold">
                  Inter-City Transit Matrix
                </div>
                <h3 className="text-xl font-black text-slate-950 tracking-tight">
                  Travel Air Guard Route Planner
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Compute point-to-point respiratory exposure deltas between any 2 of the 48 supported Indian smart cities.
                </p>
                <div className="space-y-2 pt-2 text-xs text-slate-700 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Aviation True HEPA vs AC Rail Cabin Guidance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Diurnal Inversion Departure Time Windows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dynamic AirGuard Luggage Packing Checklist</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => onNavigateToApp && onNavigateToApp('travel')}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/25"
                >
                  <span>Plan Route Exposure</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 3: Eco-Shield & Fluid Wave */}
            <div className="group relative rounded-3xl p-7 bg-white border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgba(6,182,212,0.22)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Harmonic Aerodynamics
                </div>
                <h3 className="text-xl font-black text-slate-950 tracking-tight">
                  Eco-Shield & Fluid Wave Lab
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Interactive HTML5 Canvas fluid streamlines with interactive ripples, CADR clearance decay curves, and purifier ACH.
                </p>
                <div className="space-y-2 pt-2 text-xs text-slate-700 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Interactive Mouse Water Ripple Physics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Indoor 90% Clean Air Flush Timer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Projected HEPA Filter Replacement Life</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => onNavigateToApp && onNavigateToApp('ecoshield')}
                  className="w-full py-3 rounded-2xl bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
                >
                  <span>Test Fluid Wave</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 6. BENTO GRID: Liquid Glass, Soft Radius, Telemetry                */}
        {/* =================================================================== */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-fuchsia-600 bg-fuchsia-100 px-3 py-1 rounded-full border border-fuchsia-200">
              🍱 State-of-the-Art Bento Layout
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Atmospheric Telemetry Bento Matrix
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Asymmetric bento modules packed with raw environmental intelligence and liquid blur.
            </p>
          </div>

          {/* Bento Container */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Bento Item 1: Wide Card (Span 8) */}
            <div className="md:col-span-8 rounded-3xl p-8 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.25)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/40">
                    48 CITIES • 111 CAAQMS STATIONS
                  </span>
                  <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    SYNCED 100%
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Pan-India Continuous Ambient Air Quality Grid
                </h3>
                <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                  Real-time multi-pollutant ingestion tracking PM2.5, PM10, NO2, SO2, CO, Ozone, and NH3 with strict statutory CPCB National AQI sub-index breakpoint calculations.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="text-xs text-slate-400">Total Observations</div>
                    <div className="text-xl font-black text-white">273,102</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="text-xs text-slate-400">Active Stations</div>
                    <div className="text-xl font-black text-cyan-400">111 Nodes</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="text-xs text-slate-400">States Covered</div>
                    <div className="text-xl font-black text-fuchsia-400">36 States/UTs</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="text-xs text-slate-400">ML Forecast Horizon</div>
                    <div className="text-xl font-black text-emerald-400">72 Hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Item 2: Tall Card (Span 4) */}
            <div className="md:col-span-4 rounded-3xl p-7 bg-white border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(168,85,247,0.18)] transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-bold">
                  🔮
                </div>
                <h3 className="text-xl font-black text-slate-950">
                  HistGradientBoosting Forecaster
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Autoregressive lag features (1h, 6h, 12h, 24h) generating 10th to 90th percentile prediction uncertainty envelopes.
                </p>
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-xs text-purple-900 font-mono space-y-1">
                  <div>Model: <span className="font-bold">HistGradientBoosting</span></div>
                  <div>R² Score: <span className="text-emerald-600 font-bold">0.894</span></div>
                  <div>Quantiles: <span className="text-purple-700 font-bold">P10, P50, P90</span></div>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => onNavigateToApp && onNavigateToApp('forecast')}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
                >
                  View ML Metrics &rarr;
                </button>
              </div>
            </div>

            {/* Bento Item 3: Square Card (Span 4) */}
            <div className="md:col-span-4 rounded-3xl p-7 bg-white border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-xl font-bold">
                🌐
              </div>
              <h3 className="text-lg font-black text-slate-950">
                3D Earth & Atmosphere
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rotatable WebGL globe charting global megacity atmospheric corridors from Delhi to Tokyo.
              </p>
              <button
                onClick={() => onNavigateToApp && onNavigateToApp('earth3d')}
                className="text-xs font-bold text-cyan-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Launch 3D Globe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bento Item 4: Square Card (Span 4) */}
            <div className="md:col-span-4 rounded-3xl p-7 bg-white border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
                🧭
              </div>
              <h3 className="text-lg font-black text-slate-950">
                360° Street View Radar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-click browser GPS teleportation with live reverse-geocoded panoramic street frames.
              </p>
              <button
                onClick={() => onNavigateToApp && onNavigateToApp('streetview')}
                className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Teleport to Street View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bento Item 5: Square Card (Span 4) */}
            <div className="md:col-span-4 rounded-3xl p-7 bg-white border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-xl font-bold">
                🎛️
              </div>
              <h3 className="text-lg font-black text-slate-950">
                "What-If" Policy Studio
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulate Odd-Even vehicle rationing, smog guns, industrial caps, and respiratory ER visit drops.
              </p>
              <button
                onClick={() => onNavigateToApp && onNavigateToApp('scenario')}
                className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Open Policy Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 7. "NO REAL PRODUCT DEMO" SATIRE HERO SECTION                       */}
        {/* =================================================================== */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-950 text-white border-2 border-fuchsia-500/40 shadow-[0_30px_70px_rgba(147,51,234,0.35)] relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-fuchsia-500/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-black uppercase tracking-wider text-pink-300 bg-pink-950/80 px-3 py-1 rounded-full border border-pink-700">
              ⚡ Instant Magic Abstract Demo
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Zero complicated charts. <br />
              Just press the <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 bg-clip-text text-transparent">Instant AI Fix</span> button.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Why look at complex multi-sensor time-series scatter plots when you can press a single glowing purple button that instantly purifies your vibes?
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleMagicClick}
                className="px-8 py-4 rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-slate-950 font-black text-base shadow-[0_15px_35px_rgba(234,179,8,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
                <span>{magicButtonPushed ? '🎉 VIBES ELEVATED 1000%!' : 'Press For Instant Clean Air Magic'}</span>
              </button>

              <button
                onClick={() => onNavigateToApp && onNavigateToApp('dashboard')}
                className="px-6 py-4 rounded-3xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <span>(Or see the actual real scientific data)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 8. 3 PRICING TIERS: Checkmark Bullets, Soft Radius, Purple/Black    */}
        {/* =================================================================== */}
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              💸 Transparent SaaS Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Invest in Pure Oxygen
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Simple, transparent pricing tailored for biological organisms, municipal administrators, and celestial weather gods.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.2 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black">
                  SAVE 25%
                </span>
              </button>
            </div>
          </div>

          {/* EXACTLY 3 PRICING TIERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Free */}
            <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all flex flex-col justify-between">
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Tier 01
                  </span>
                  <h3 className="text-2xl font-black text-slate-950">
                    Mortal Breather 🍃
                  </h3>
                  <p className="text-xs text-slate-500">
                    For individuals who inhale ordinary atmospheric air.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-950">$0</span>
                  <span className="text-xs text-slate-400 font-bold">/ forever</span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Real-time CPCB NAQI for 48 Indian Cities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Basic 3D Earth Globe & Wind Vector Visualizer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Live GPS 360° Street View Teleportation</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 line-through">
                    <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>Quantum Inversion Risk Predictions</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onNavigateToApp && onNavigateToApp('dashboard')}
                  className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs transition"
                >
                  Start Free Breathing
                </button>
              </div>
            </div>

            {/* Tier 2: Pro (MOST POPULAR) */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-b from-purple-950 via-slate-950 to-black text-white border-2 border-fuchsia-500 shadow-[0_25px_60px_rgba(147,51,234,0.35)] hover:-translate-y-2 transition-all flex flex-col justify-between">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
                🔥 MOST POPULAR
              </div>

              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-pink-400">
                    Tier 02
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Pro Hyper-Ventilator ⚡
                  </h3>
                  <p className="text-xs text-slate-300">
                    For high-performing human beings who require pure oxygen.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">
                    {billingCycle === 'annual' ? '$39' : '$49'}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">/ month</span>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-3 text-xs text-slate-200 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>Everything in Mortal Breather</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>3D Gaussian Plume WebGL Physics Simulator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>Travel Air Guard 48-City Route Exposure Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>Eco-Shield Indoor Air Purifier & Fluid Wave Lab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>72-Hour Quantile Machine Learning Predictions</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onNavigateToApp && onNavigateToApp('travel')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-cyan-500 text-white font-black text-sm shadow-[0_15px_30px_rgba(217,70,239,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Get Hyper-Ventilator
                </button>
              </div>
            </div>

            {/* Tier 3: Enterprise */}
            <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all flex flex-col justify-between">
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Tier 03
                  </span>
                  <h3 className="text-2xl font-black text-slate-950">
                    Biosphere Deity 👑
                  </h3>
                  <p className="text-xs text-slate-500">
                    For municipal mayors, smart cities, and weather gods.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-950">
                    {billingCycle === 'annual' ? '$399' : '$499'}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">/ month</span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Everything in Pro Hyper-Ventilator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Custom City CAAQMS Ingestion Pipeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>"What-If" Policy Simulator & ER Visit Predictor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dedicated Environmental Engineer on Speed Dial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Raw CSV/JSON Ingestion & REST API Key</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onNavigateToApp && onNavigateToApp('scenario')}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition"
                >
                  Contact Sovereign Sales
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 9. COMICAL FOOTER: "NO TOS, NO PRIVACY POLICY"                      */}
        {/* =================================================================== */}
        <footer className="pt-12 pb-6 border-t border-slate-200 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="font-black text-lg text-slate-950">
              AirGuard <span className="text-fuchsia-600">AI</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
              v2.5 ULTRA
            </span>
          </div>

          <div className="text-xs text-slate-500 max-w-lg mx-auto font-medium leading-relaxed">
            Built with pure white backgrounds, harsh gradients, lucide icons, bento grids, dot grids, radial orbs, liquid glass, 3 pricing tiers, checkmark bullets, and absolute engineering devotion.
          </div>

          {/* Hilarious "No TOS No Privacy Policy" Tag */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-purple-700 pt-2">
            <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
              🚫 No Terms of Service
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
              🚫 No Privacy Policy
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
              ✨ Just Pure Vibes & Unhinged Atmosphere
            </span>
          </div>

          <div className="text-[11px] text-slate-400 pt-3">
            © 2026 SmartCity AirGuard AI System • All rights reserved across Earth & Low Orbit
          </div>
        </footer>
      </div>
    </div>
  );
};
