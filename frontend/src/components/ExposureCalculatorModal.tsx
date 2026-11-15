import React, { useState, useMemo } from 'react';
import {
  X,
  HeartPulse,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Clock,
  Activity,
  AlertTriangle,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ThreeDCard } from './ThreeDCard';
import { ThreeDIcon } from './ThreeDIcon';

interface ExposureCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAqi: number;
  currentPm25: number;
  cityName: string;
}

export const ExposureCalculatorModal: React.FC<ExposureCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentAqi,
  currentPm25,
  cityName,
}) => {
  const [commuteMinutes, setCommuteMinutes] = useState<number>(35);
  const [commuteMode, setCommuteMode] = useState<'walk' | 'cycle' | 'autorickshaw' | 'bus' | 'car_metro'>('walk');
  const [maskType, setMaskType] = useState<'none' | 'cloth' | 'surgical' | 'n95'>('none');

  const modes = [
    { id: 'walk', name: 'Walking', icon: 'runner' as const, exertion: 1.8, exposureFactor: 1.0, desc: 'Moderate roadside inhalation' },
    { id: 'cycle', name: 'Cycling / Running', icon: 'runner' as const, exertion: 3.2, exposureFactor: 1.15, desc: 'Heavy breathing rate, deep lung penetration' },
    { id: 'autorickshaw', name: 'Open Auto / Bike', icon: 'car' as const, exertion: 1.0, exposureFactor: 1.35, desc: 'Direct tailpipe exhaust intake' },
    { id: 'bus', name: 'Non-AC Bus', icon: 'car' as const, exertion: 1.0, exposureFactor: 0.95, desc: 'Ambient road particulate level' },
    { id: 'car_metro', name: 'AC Metro / Car (HEPA)', icon: 'shield' as const, exertion: 1.0, exposureFactor: 0.2, desc: 'Closed cabin with 80% filtration' },
  ];

  const masks = [
    { id: 'none', name: 'No Mask', filtration: 0 },
    { id: 'cloth', name: 'Cloth Mask', filtration: 0.2 },
    { id: 'surgical', name: 'Surgical Mask', filtration: 0.45 },
    { id: 'n95', name: 'Certified N95 / FFP2', filtration: 0.95 },
  ];

  const exposureResults = useMemo(() => {
    // Normal resting tidal breathing rate: ~8 Liters per minute = 0.008 m³/min
    const baseBreathingRateLpm = 8;
    const selectedModeObj = modes.find((m) => m.id === commuteMode) || modes[0];
    const selectedMaskObj = masks.find((m) => m.id === maskType) || masks[0];

    // Inhaled volume in cubic meters
    const totalVolumeM3 = (baseBreathingRateLpm * selectedModeObj.exertion * commuteMinutes) / 1000;

    // Ambient PM2.5 in µg/m³
    const effectiveAmbientPm25 = (currentPm25 || 85) * selectedModeObj.exposureFactor;

    // Dosage inhaled after mask filtration
    const unmaskedDosageUg = totalVolumeM3 * effectiveAmbientPm25;
    const actualInhaledDosageUg = unmaskedDosageUg * (1 - selectedMaskObj.filtration);

    // Cigarette equivalence: 1 cigarette delivers approximately 22 micrograms of PM2.5
    const cigaretteEquivalent = Math.max(0, actualInhaledDosageUg / 22);

    // Lung stress level
    const riskLevel =
      actualInhaledDosageUg > 45
        ? 'Dangerous'
        : actualInhaledDosageUg > 25
        ? 'High Risk'
        : actualInhaledDosageUg > 12
        ? 'Moderate'
        : 'Safe';

    return {
      inhaledMicrograms: Math.round(actualInhaledDosageUg * 10) / 10,
      unmaskedMicrograms: Math.round(unmaskedDosageUg * 10) / 10,
      cigaretteEquivalent: Math.round(cigaretteEquivalent * 10) / 10,
      riskLevel,
      totalVolumeM3: Math.round(totalVolumeM3 * 100) / 100,
    };
  }, [commuteMinutes, commuteMode, maskType, currentPm25]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-2xl glass-panel border border-emerald-500/30 rounded-3xl shadow-spatial-glass overflow-hidden divide-y divide-emerald-900/40">
        {/* Header */}
        <div className="p-6 flex items-center justify-between bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-glow-red">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Personal Respiratory Exposure Calculator
              </h2>
              <p className="text-xs text-slate-300">
                Calculates microgram particulate inhalation dosage for {cityName} (PM2.5: {currentPm25 || 85} µg/m³)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-slate-400 hover:text-white border border-emerald-500/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Commute Duration Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" /> Commute / Exposure Duration
              </span>
              <span className="text-mint-300 font-mono text-sm font-bold">{commuteMinutes} Minutes</span>
            </div>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={commuteMinutes}
              onChange={(e) => setCommuteMinutes(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-forest-900 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Commute Mode Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
              Travel & Commuting Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setCommuteMode(m.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    commuteMode === m.id
                      ? 'bg-emerald-500/20 border-emerald-500/60 shadow-glow-emerald text-white'
                      : 'bg-forest-950/70 border-emerald-900/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs text-white mb-0.5">{m.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mask Protection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
              Respiratory Protective Mask
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {masks.map((mask) => (
                <button
                  key={mask.id}
                  onClick={() => setMaskType(mask.id as any)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    maskType === mask.id
                      ? 'bg-emerald-500/25 border-emerald-400 text-mint-300 shadow-glow-emerald'
                      : 'bg-forest-950/70 border-emerald-900/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>{mask.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    {mask.filtration > 0 ? `-${Math.round(mask.filtration * 100)}% Particulates` : '0% Filter'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Results 3D Impact Card */}
          <ThreeDCard glowColor={exposureResults.riskLevel === 'Dangerous' ? 'rose' : 'emerald'} tiltStrength={8}>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 border border-emerald-500/25 shadow-glass space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Activity className="w-4 h-4 text-rose-400" /> Commute Inhalation Dose
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full font-mono ${
                    exposureResults.riskLevel === 'Dangerous'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : exposureResults.riskLevel === 'High Risk'
                      ? 'bg-orange-950 text-orange-300 border border-orange-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  Risk: {exposureResults.riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center font-mono">
                <div className="p-3 rounded-xl bg-forest-950/80 border border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 block font-semibold">INHALED PM2.5</span>
                  <div className="text-2xl font-black text-white mt-1">
                    {exposureResults.inhaledMicrograms} <span className="text-xs font-normal text-slate-400">µg</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    vs {exposureResults.unmaskedMicrograms} µg unmasked
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-forest-950/80 border border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 block font-semibold">CIGARETTE EQUIV.</span>
                  <div className="text-2xl font-black text-rose-400 mt-1">
                    {exposureResults.cigaretteEquivalent} <span className="text-xs font-normal text-slate-400">cigs</span>
                  </div>
                  <span className="text-[10px] text-slate-400">22 µg PM2.5 ≈ 1 cig</span>
                </div>

                <div className="p-3 rounded-xl bg-forest-950/80 border border-emerald-900/40 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">AIR VOLUME</span>
                  <div className="text-2xl font-black text-mint-300 mt-1">
                    {exposureResults.totalVolumeM3} <span className="text-xs font-normal text-slate-400">m³</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Inhaled over {commuteMinutes}m</span>
                </div>
              </div>

              {/* Actionable Medical Advice */}
              <div className="p-3 rounded-xl bg-forest-950/60 border border-emerald-900/40 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Health Protection Recommendation:
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {exposureResults.riskLevel === 'Dangerous' || exposureResults.riskLevel === 'High Risk'
                    ? 'Your commute route passes through elevated particulate concentrations. Switching to an AC metro or wearing an N95 respirator reduces particulate lung deposition by up to 95%.'
                    : 'Your current route and protective gear keep your inhaled dosage within manageable ranges. Maintain nasal breathing and avoid heavy cardio along main arterial roadways.'}
                </p>
              </div>
            </div>
          </ThreeDCard>
        </div>

        {/* Footer */}
        <div className="p-4 bg-forest-950/70 flex items-center justify-between text-xs text-slate-400 px-6 font-mono">
          <span>Based on WHO & CPCB Epidemiological Inhalation Models</span>
          <button
            onClick={onClose}
            className="btn-cinematic-emerald px-5 py-2 rounded-xl font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
