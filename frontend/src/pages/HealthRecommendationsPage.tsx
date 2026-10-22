import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Heart,
  Wind,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Activity,
  Baby,
  PersonStanding,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { CurrentSummary, HealthRecommendationResponse, ActivityItem, VulnerableGroupItem } from '../types';

interface HealthRecommendationsPageProps {
  summary: CurrentSummary | null;
  selectedCity: string;
}

export const HealthRecommendationsPage: React.FC<HealthRecommendationsPageProps> = ({
  summary,
  selectedCity
}) => {
  const currentAqi = summary?.overall_aqi ?? 145;
  const currentCategory = summary?.overall_category ?? 'Moderate';

  const [activeAqi, setActiveAqi] = useState<number>(currentAqi);
  const [data, setData] = useState<HealthRecommendationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProfile, setSelectedProfile] = useState<'general' | 'athlete' | 'child' | 'elderly' | 'asthma'>('general');

  useEffect(() => {
    setActiveAqi(currentAqi);
  }, [currentAqi]);

  const fetchGuidance = async (aqiVal: number) => {
    try {
      setLoading(true);
      const res = await api.getHealthRecommendations({
        aqi: aqiVal,
        category: aqiVal <= 50 ? 'Good' : aqiVal <= 100 ? 'Satisfactory' : aqiVal <= 200 ? 'Moderate' : aqiVal <= 300 ? 'Poor' : aqiVal <= 400 ? 'Very Poor' : 'Severe',
        dominantPollutant: 'pm25'
      });
      setData(res);
    } catch (err) {
      console.error('Failed to fetch health guidance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidance(activeAqi);
  }, [activeAqi]);

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#84cc16';
    if (aqi <= 200) return '#f59e0b';
    if (aqi <= 300) return '#f97316';
    if (aqi <= 400) return '#ef4444';
    return '#7f1d1d';
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4" />
              Public Health Advisory Engine
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Health Recommendations & Outdoor Activity Planner
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Evidence-based exercise advisories, school protocols, and vulnerable group protections for{' '}
              <strong className="text-white">{selectedCity === 'All' ? 'Current Grid' : selectedCity}</strong> based on CPCB NAQI standards.
            </p>
          </div>

          {/* Quick sync button with live AQI */}
          <button
            onClick={() => {
              setActiveAqi(currentAqi);
              fetchGuidance(currentAqi);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            Reset to Live City AQI ({currentAqi})
          </button>
        </div>

        {/* Interactive AQI Slider Simulator */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Simulate Health Impact at Different AQI Levels:</span>
            <span className="font-extrabold text-base" style={{ color: getAqiColor(activeAqi) }}>
              AQI {activeAqi} ({data?.category || 'Analyzing'})
            </span>
          </div>

          <input
            type="range"
            min={10}
            max={500}
            step={5}
            value={activeAqi}
            onChange={(e) => setActiveAqi(Number(e.target.value))}
            className="w-full accent-cyan-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-medium">
            <span className="text-emerald-400">Good (0-50)</span>
            <span className="text-lime-400">Satisfactory (51-100)</span>
            <span className="text-amber-400">Moderate (101-200)</span>
            <span className="text-orange-400">Poor (201-300)</span>
            <span className="text-rose-400">Very Poor (301-400)</span>
            <span className="text-rose-700">Severe (401-500)</span>
          </div>
        </div>
      </div>

      {/* Primary Status Card & Profile Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Status Matrix */}
        <div className="lg:col-span-8 space-y-6">
          {/* Executive Advisory Box */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span
                  className="text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2"
                  style={{
                    backgroundColor: `${getAqiColor(activeAqi)}20`,
                    color: getAqiColor(activeAqi),
                    border: `1px solid ${getAqiColor(activeAqi)}40`
                  }}
                >
                  CPCB Status: {data?.category}
                </span>
                <h3 className="text-xl font-bold text-white">General Population Guidance</h3>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {data?.general_advice}
                </p>
              </div>

              <div className="text-center p-3 rounded-xl bg-slate-950 border border-slate-800 flex-shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Mask Status</span>
                {data?.mask_required ? (
                  <span className="text-xs font-extrabold text-rose-400 flex items-center gap-1 justify-center mt-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> N95 Advised
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 justify-center mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Optional
                  </span>
                )}
              </div>
            </div>

            {/* Quick Guidelines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] font-bold text-cyan-400 uppercase block mb-1">Exercise</span>
                <p className="text-xs text-slate-300">{data?.exercise_guidance}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] font-bold text-amber-400 uppercase block mb-1">Ventilation</span>
                <p className="text-xs text-slate-300">{data?.window_guidance}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] font-bold text-purple-400 uppercase block mb-1">Schools & Sports</span>
                <p className="text-xs text-slate-300">{data?.school_sports_guidance}</p>
              </div>
            </div>
          </div>

          {/* Outdoor Activity Recommendations */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Outdoor Activity & Sports Feasibility</span>
              <span className="text-xs font-normal text-slate-400">Real-time Safety Check</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data?.activity_recommendations.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-200 block">{item.activity}</span>
                    <p className="text-xs text-slate-400 leading-snug">{item.notes}</p>
                  </div>

                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                      item.allowed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Vulnerable Groups & Disclaimer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-rose-400">
              Vulnerable Demographic Protocols
            </h3>
            <p className="text-xs text-slate-400">
              Targeted protective advisories for high-susceptibility community segments.
            </p>

            <div className="space-y-3 pt-2">
              {data?.vulnerable_groups.map((group, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{group.group}</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        group.risk_level === 'Critical' || group.risk_level === 'Immediate Alert'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : group.risk_level === 'High'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {group.risk_level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{group.guidance}</p>
                  <div className="text-[11px] text-cyan-400/90 font-medium pt-1">
                    Action: {group.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Statutory Health Disclaimer
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {data?.disclaimer ||
                'This environmental guidance is compiled strictly for public health education from Central Pollution Control Board (CPCB) publications. It does not constitute individualized clinical diagnosis or replace consultation with certified healthcare physicians.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
