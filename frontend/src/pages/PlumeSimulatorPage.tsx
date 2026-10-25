import React from 'react';
import { Wind, Flame, Layers, Activity, ShieldCheck, HelpCircle, FileText } from 'lucide-react';
import { PlumeDispersion3D } from '../components/PlumeDispersion3D';

export const PlumeSimulatorPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Wind className="w-4 h-4" />
              Environmental Fluid Dynamics & Atmospheric Physics
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              3D Gaussian Plume Dispersion Simulator
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Interactive 3D micro-meteorological simulation modeling industrial point-source gaseous and particulate emissions.
              Calculates spatial advection, lateral eddy diffusion, and ground-level concentration profiles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold">
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
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
            <Activity className="w-4 h-4" /> Mathematical Formula
          </div>
          <h3 className="text-base font-bold text-white">Gaussian Dispersion Equation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The steady-state atmospheric concentration $C(x, y, z)$ downwind of a point emission stack of effective height $H$ with continuous emission rate $Q$ and mean wind speed $u$:
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-cyan-300 leading-relaxed overflow-x-auto">
            C(x,y,z) = [Q / (2π · u · σy · σz)] · exp(-y² / 2σy²)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;· [exp(-(z-H)² / 2σz²) + exp(-(z+H)² / 2σz²)]
          </div>

          <p className="text-[11px] text-slate-400">
            The second exponential term models total reflection of particulate aerosols at the ground boundary ($z=0$).
          </p>
        </div>

        {/* Card 2: Pasquill Stability Classification */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase">
            <Layers className="w-4 h-4" /> Atmospheric Stability
          </div>
          <h3 className="text-base font-bold text-white">Pasquill-Gifford Classes</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Atmospheric turbulence governs the growth of dispersion parameters $\sigma_y(x)$ and $\sigma_z(x)$:
          </p>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-rose-400">Class A - B:</span>
              <span className="text-slate-300">Strong solar heating, intense looping plume</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-cyan-400">Class C - D:</span>
              <span className="text-slate-300">Neutral conditions, conical dispersion plume</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-amber-400">Class E - F:</span>
              <span className="text-slate-300">Nocturnal inversion, fanning smog layer</span>
            </div>
          </div>
        </div>

        {/* Card 3: Regulatory Stack Emission Limits */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4" /> CPCB Regulations
          </div>
          <h3 className="text-base font-bold text-white">Statutory Emission Caps</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Under the Environment (Protection) Rules and CPCB emission standards for thermal power plants and industrial kilns:
          </p>

          <ul className="space-y-2 text-xs text-slate-300">
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
