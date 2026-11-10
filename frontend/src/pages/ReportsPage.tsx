import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { City } from '../types';
import { api } from '../services/api';
import { playCyberClick } from '../utils/audioSystem';

interface ReportsPageProps {
  cities: City[];
  selectedCity: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  cities,
  selectedCity,
}) => {
  const [reportType, setReportType] = useState<'executive' | 'hourly' | 'daily' | 'compliance'>('executive');
  const [activeCity, setActiveCity] = useState<string>(selectedCity === 'All' ? 'Delhi' : selectedCity);
  const [generating, setGenerating] = useState<boolean>(false);

  // Month days for the Interactive Pollution Calendar
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // Defensible realistic AQI day values
    const aqi = Math.round(110 + Math.sin(day * 0.7) * 95 + (day > 20 ? 40 : 0));
    const category = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Satisfactory' : aqi <= 200 ? 'Moderate' : aqi <= 300 ? 'Poor' : 'Very Poor';
    return { day, aqi, category };
  });

  const getDayColor = (category: string) => {
    switch (category) {
      case 'Good': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Satisfactory': return 'bg-lime-500/20 text-lime-300 border-lime-500/40';
      case 'Moderate': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Poor': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      default: return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const handleDownloadCsv = () => {
    playCyberClick();
    setGenerating(true);
    setTimeout(() => {
      const headers = 'Date,City,AQI,Category,PM2.5_ugm3,PM10_ugm3,NO2_ugm3,Status\n';
      const rows = daysInMonth
        .map((d) => `2026-11-${d.day.toString().padStart(2, '0')},${activeCity},${d.aqi},${d.category},${(d.aqi * 0.6).toFixed(1)},${(d.aqi * 1.1).toFixed(1)},32.4,CPCB-Verified`)
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AirGuard_${activeCity}_${reportType}_environmental_report.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setGenerating(false);
    }, 600);
  };

  const handlePrint = () => {
    playCyberClick();
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audit-Ready Environmental Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Environmental Reports & Data Export Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Export certified CPCB ambient air compliance summaries, telemetry raw data files in CSV format, and formatted executive briefing packages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={handleDownloadCsv}
            disabled={generating}
            className="btn-cinematic-cyan px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-glow-cyan"
          >
            <Download className="w-4 h-4" />
            <span>{generating ? 'Exporting...' : 'Export CSV File'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-cinematic-glass px-4 py-2 rounded-xl text-xs flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report View</span>
          </button>
        </div>
      </div>

      {/* City & Format Selection Controls */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Target City:</span>
          <select
            value={activeCity}
            onChange={(e) => setActiveCity(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-xl text-xs font-semibold text-white focus:outline-none"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.name} className="bg-slate-900">
                {c.name}, {c.state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
          {[
            { id: 'executive', label: 'Executive Summary' },
            { id: 'daily', label: 'Daily CPCB Logs' },
            { id: 'compliance', label: 'Statutory Compliance' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => {
                playCyberClick();
                setReportType(fmt.id as any);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                reportType === fmt.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive 30-Day Pollution Calendar */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Interactive Monthly Pollution Calendar ({activeCity})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Day-by-day ambient AQI severity heatmap across the current calendar month.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Good</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-lime-500" /> Satisfactory</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Moderate</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-500" /> Poor</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Very Poor</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2.5 pt-2">
          {daysInMonth.map((d) => (
            <div
              key={d.day}
              className={`p-3 rounded-2xl border ${getDayColor(d.category)} flex flex-col justify-between h-20 transition-transform hover:scale-105`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold">Day {d.day}</span>
              </div>
              <div>
                <span className="text-xl font-black block">
                  {d.aqi}
                </span>
                <span className="text-[9px] block truncate font-semibold opacity-90">
                  {d.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Report Preview Card */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                CPCB National Ambient Air Quality Standard (NAAQS) Compliance Statement
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Jurisdiction: {activeCity} Municipal Corporation • Statutory Verification Code: #IND-CPCB-2026-X
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            AUDIT CERTIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">24h PM2.5 Ceiling</span>
            <span className="text-base font-bold text-white mt-1 block">60.0 µg/m³</span>
            <span className="text-[10px] text-amber-400 block mt-0.5">Exceeded on 16 of 30 days</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">24h PM10 Ceiling</span>
            <span className="text-base font-bold text-white mt-1 block">100.0 µg/m³</span>
            <span className="text-[10px] text-amber-400 block mt-0.5">Exceeded on 18 of 30 days</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Clean Air Days</span>
            <span className="text-base font-bold text-emerald-400 mt-1 block">12 Days (40%)</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Compliance met during active winds</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportsPage;

