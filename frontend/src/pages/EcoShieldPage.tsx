import React, { useState } from 'react';
import {
  Droplets,
  Shield,
  ShieldCheck,
  Wind,
  Fan,
  Sparkles,
  Zap,
  Activity,
  HeartPulse,
  Info,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { FluidAtmosphericWave } from '../components/FluidAtmosphericWave';
import { AQIBadge } from '../components/AQIBadge';

export const EcoShieldPage: React.FC = () => {
  // Indoor simulation state
  const [purifierOn, setPurifierOn] = useState<boolean>(true);
  const [roomArea, setRoomArea] = useState<number>(25); // m²
  const [ceilingHeight, setCeilingHeight] = useState<number>(3.0); // m
  const [cadrRating, setCadrRating] = useState<number>(380); // m³/h (standard HEPA)
  const [outdoorAqi, setOutdoorAqi] = useState<number>(240); // default severe/poor
  const [occupants, setOccupants] = useState<number>(2);

  // Computations
  const roomVolume = Math.round(roomArea * ceilingHeight);
  const airChangesPerHour = Math.round((cadrRating / Math.max(1, roomVolume)) * 10) / 10;
  
  // Clean air flush time: 90% reduction time in minutes: t = (2.3 / ACH) * 60
  const flushTimeMinutes = airChangesPerHour > 0 ? Math.round((2.3 / airChangesPerHour) * 60) : 120;
  
  // Indoor AQI equilibrium: When purifier is active, 75-88% reduction
  const indoorAqi = purifierOn
    ? Math.max(18, Math.round(outdoorAqi * (1 / (1 + (airChangesPerHour * 0.7)))))
    : outdoorAqi;

  const reductionPercent = outdoorAqi > 0 ? Math.round(((outdoorAqi - indoorAqi) / outdoorAqi) * 100) : 0;
  const filterLifespanDays = Math.max(25, Math.round(180 - (outdoorAqi * 0.35)));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Banner */}
      <div className="glass-watery-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Droplets className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span>Fluid Aerodynamics & Clean Air Oasis Lab</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Eco-Shield Indoor Air Purifier & Fluid Wave Simulator
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Model real-time indoor particulate clearance, Clean Air Delivery Rate (CADR), and harmonic fluid wave streamlines under Indian urban smog conditions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setPurifierOn(!purifierOn)}
              className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2.5 shadow-xl transition-all ${
                purifierOn
                  ? 'btn-liquid-emerald ring-2 ring-emerald-400/50'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Fan className={`w-4 h-4 ${purifierOn ? 'animate-spin' : ''}`} />
              <span>{purifierOn ? 'Eco-Shield: ENGAGED' : 'Eco-Shield: STANDBY'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Watery Fluid Wave Canvas Simulation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Fluid Wave Aerodynamic Streamlines
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-300 px-2.5 py-1 rounded-xl bg-cyan-950/80 border border-cyan-800">
            {purifierOn ? 'Filtered Clean Air Current' : 'Ambient Untreated Flow'}
          </span>
        </div>

        <FluidAtmosphericWave
          aqi={indoorAqi}
          windSpeed={purifierOn ? 12 : 5}
          temperature={25}
          height="420px"
          purifierActive={purifierOn}
          showControls={true}
        />
      </div>

      {/* Simulation Controls & Dynamic Clean Air Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Control Panel */}
        <div className="lg:col-span-5 glass-watery-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Enclosure & Air Purifier Parameters
            </h3>
          </div>

          {/* Room Area Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Room Floor Area:</span>
              <span className="text-cyan-400 font-mono font-bold">{roomArea} m² (~{(roomArea * 10.76).toFixed(0)} sq ft)</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={roomArea}
              onChange={(e) => setRoomArea(parseInt(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 rounded bg-slate-800 cursor-pointer"
            />
          </div>

          {/* Ceiling Height Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Ceiling Height:</span>
              <span className="text-cyan-400 font-mono font-bold">{ceilingHeight.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="2.4"
              max="4.5"
              step="0.1"
              value={ceilingHeight}
              onChange={(e) => setCeilingHeight(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 rounded bg-slate-800 cursor-pointer"
            />
          </div>

          {/* Purifier CADR Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Purifier CADR Rating:</span>
              <span className="text-teal-400 font-mono font-bold">{cadrRating} m³/h</span>
            </div>
            <input
              type="range"
              min="150"
              max="800"
              step="25"
              value={cadrRating}
              onChange={(e) => setCadrRating(parseInt(e.target.value))}
              className="w-full accent-teal-400 h-1.5 rounded bg-slate-800 cursor-pointer"
            />
          </div>

          {/* Outdoor Ambient AQI Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Outdoor City AQI:</span>
              <span className="text-rose-400 font-mono font-bold">{outdoorAqi} AQI</span>
            </div>
            <input
              type="range"
              min="30"
              max="480"
              step="10"
              value={outdoorAqi}
              onChange={(e) => setOutdoorAqi(parseInt(e.target.value))}
              className="w-full accent-rose-400 h-1.5 rounded bg-slate-800 cursor-pointer"
            />
          </div>

          {/* Active Occupants */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Active Room Occupants:</span>
              <span className="text-purple-400 font-mono font-bold">{occupants} People</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={occupants}
              onChange={(e) => setOccupants(parseInt(e.target.value))}
              className="w-full accent-purple-400 h-1.5 rounded bg-slate-800 cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Standard Medical Enclosure Recommendation</span>
            </div>
            <p>
              Target at least <strong>5.0 ACH</strong> (Air Changes per Hour) for high-risk respiratory patients during winter smog episodes.
            </p>
          </div>
        </div>

        {/* Results & Health Impact KPI Grid */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Indoor Equilibrium AQI Card */}
            <div className="glass-watery-card rounded-2xl p-5 border-l-4 border-l-cyan-400 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Indoor Settling AQI</span>
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">{indoorAqi}</div>
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{reductionPercent}% Lower than Outdoor</span>
              </div>
            </div>

            {/* Air Changes Per Hour (ACH) */}
            <div className="glass-watery-card rounded-2xl p-5 border-l-4 border-l-teal-400 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Air Changes Per Hour (ACH)</span>
                <Fan className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-3xl font-black text-white">{airChangesPerHour} <span className="text-xs text-slate-400 font-normal">ACH</span></div>
              <div className="text-xs text-slate-300">
                {airChangesPerHour >= 5 ? 'Excellent Medical Grade Turnover' : 'Moderate Turnover Rate'}
              </div>
            </div>

            {/* 90% Clean Flush Time */}
            <div className="glass-watery-card rounded-2xl p-5 border-l-4 border-l-purple-400 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>90% Clearance Time</span>
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white">{flushTimeMinutes} <span className="text-xs text-slate-400 font-normal">Minutes</span></div>
              <div className="text-xs text-slate-300">
                Time required to filter 90% of particulate smog
              </div>
            </div>

            {/* Estimated HEPA Filter Life */}
            <div className="glass-watery-card rounded-2xl p-5 border-l-4 border-l-amber-400 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Projected HEPA Life</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white">{filterLifespanDays} <span className="text-xs text-slate-400 font-normal">Days</span></div>
              <div className="text-xs text-slate-300">
                Based on continuous {outdoorAqi} AQI ambient load
              </div>
            </div>
          </div>

          {/* Actionable Clean Air Protocols Card */}
          <div className="glass-watery-card rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Recommended Clean Air Sanctuary Protocol</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <strong className="text-slate-200">Seal Infiltration Gaps:</strong>
                <p className="text-slate-400 leading-relaxed">
                  Weather-strip doors and window frames to minimize uncontrolled leakage of toxic outdoor PM2.5 into clean zones.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <strong className="text-slate-200">Continuous Low Mode:</strong>
                <p className="text-slate-400 leading-relaxed">
                  Maintain purifier on low/medium speed 24/7 rather than intermittent bursts to prevent particulate re-accumulation.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <strong className="text-slate-200">Avoid Incense & Candles:</strong>
                <p className="text-slate-400 leading-relaxed">
                  Burning dhoop, agarbatti, or paraffin candles generates indoor PM2.5 concentrations exceeding 400 µg/m³.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <strong className="text-slate-200">Active Carbon for VOCs:</strong>
                <p className="text-slate-400 leading-relaxed">
                  Ensure the air filter incorporates an activated carbon stage to neutralize NO2 and volatile organic vapors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
