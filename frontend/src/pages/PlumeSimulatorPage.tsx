import React from 'react';
import { Wind, Flame, Layers, Activity, ShieldCheck, HelpCircle, FileText } from 'lucide-react';
import { PlumeDispersion3D } from '../components/PlumeDispersion3D';

export const PlumeSimulatorPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-950/40 border border-emerald-900/40 shadow-glow-emerald/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Wind className="w-4 h-4 text-emerald-400" />
              Environmental Fluid Dynamics & Atmospheric Physics
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              3D Gaussian Plume Dispersion Simulator
            </h1>
            <p className="text-sm text-forest-200 mt-1 max-w-2xl">
              Interactive 3D micro-meteorological simulation modeling industrial point-source gaseous and particulate emissions.
              Calculates spatial advection, lateral eddy diffusion, and ground-level concentration profiles.
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-forest-900/90 border border-emerald-500/30 text-emerald-300 font-semibold shadow-glow-emerald/20">
              EPA ISC3 / AERMOD Gaussian Formula
            </span>
          </div>
        </div>
      </div>

      {/* 3D WebGL Plume Chamber */}
      <PlumeDispersion3D height="540px" />

      {/* Mathematical Principles & Engineering Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Governing Gaussian Equation */}
        <div className="p-5 rounded-2xl bg-forest-950/80 border border-emerald-900/40 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <Activity className="w-4 h-4 text-emerald-400" /> Mathematical Formula
          </div>
          <h3 className="text-base font-bold text-white">Gaussian Dispersion Equation</h3>
          <p className="text-xs text-forest-200 leading-relaxed">
            The steady-state atmospheric concentration $C(x, y, z)$ downwind of a point emission stack of effective height $H$ with continuous emission rate $Q$ and mean wind speed $u$:
          </p>

          <div className="p-3 rounded-xl bg-forest-900/60 border border-emerald-900/50 font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto">
            C(x,y,z) = [Q / (2π · u · σy · σz)] · exp(-y² / 2σy²)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· [exp(-(z-H)² / 2σz²) + exp(-(z+H)² / 2σz²)]
          </div>

          <p className="text-[11px] text-forest-400">
            The second exponential term models total reflection of particulate aerosols at the ground boundary ($z=0$).
          </p>
        </div>

        {/* Card 2: Pasquill Stability Classification */}
        <div className="p-5 rounded-2xl bg-forest-950/80 border border-emerald-900/40 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-mint-400 text-xs font-bold uppercase">
            <Layers className="w-4 h-4 text-mint-400" /> Atmospheric Stability
          </div>
          <h3 className="text-base font-bold text-white">Pasquill-Gifford Classes</h3>
          <p className="text-xs text-forest-200 leading-relaxed">
            Atmospheric turbulence governs the growth of dispersion parameters $\sigma_y(x)$ and $\sigma_z(x)$:
          </p>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-forest-900/60 border border-emerald-900/50">
              <span className="font-bold text-rose-400">Class A - B:</span>
              <span className="text-forest-200">Strong solar heating, intense looping plume</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-forest-900/60 border border-emerald-900/50">
              <span className="font-bold text-emerald-400">Class C - D:</span>
              <span className="text-forest-200">Neutral conditions, conical dispersion plume</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-forest-900/60 border border-emerald-900/50">
              <span className="font-bold text-amber-400">Class E - F:</span>
              <span className="text-forest-200">Nocturnal inversion, fanning smog layer</span>
            </div>
          </div>
        </div>

        {/* Card 3: Regulatory Stack Emission Limits */}
        <div className="p-5 rounded-2xl bg-forest-950/80 border border-emerald-900/40 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> CPCB Regulations
          </div>
          <h3 className="text-base font-bold text-white">Statutory Emission Caps</h3>
          <p className="text-xs text-forest-200 leading-relaxed">
            Under the Environment (Protection) Rules and CPCB emission standards for thermal power plants and industrial kilns:
          </p>

          <ul className="space-y-2 text-xs text-forest-200">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Particulate Matter (PM):</strong> Maximum 30–50 mg/Nm³ for modern baghouse filtration units.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Minimum Stack Height:</strong> $H = 14 \cdot Q^{0.3}$ (where $Q$ is SO₂ emission rate in kg/hr).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>FGD Systems:</strong> Flue Gas Desulfurization mandatory for thermal units within 10 km of NCR.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
