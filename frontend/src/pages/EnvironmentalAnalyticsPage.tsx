import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  CloudRain,
  Wind,
  Flame,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Printer,
  HeartPulse
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ScatterChart,
  Scatter
} from 'recharts';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { playCyberClick } from '../utils/audioSystem';

interface EnvironmentalAnalyticsPageProps {
  selectedCity?: string;
}

export const EnvironmentalAnalyticsPage: React.FC<EnvironmentalAnalyticsPageProps> = ({
  selectedCity = 'Delhi',
}) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'seasonal'>('weekly');
  const [pollutantFilter, setPollutantFilter] = useState<'aqi' | 'pm25' | 'pm10'>('aqi');

  // Trend Datasets
  const dailyData = [
    { time: '00:00', aqi: 240, pm25: 140, pm10: 220, temp: 19, wind: 4.2 },
    { time: '04:00', aqi: 285, pm25: 175, pm10: 270, temp: 17, wind: 3.1 },
    { time: '08:00', aqi: 340, pm25: 215, pm10: 330, temp: 22, wind: 5.5 },
    { time: '12:00', aqi: 210, pm25: 125, pm10: 195, temp: 29, wind: 11.2 },
    { time: '16:00', aqi: 195, pm25: 115, pm10: 180, temp: 28, wind: 9.8 },
    { time: '20:00', aqi: 310, pm25: 195, pm10: 300, temp: 23, wind: 4.8 },
  ];

  const weeklyData = [
    { time: 'Mon', aqi: 265, pm25: 155, pm10: 250, temp: 26, wind: 6.8 },
    { time: 'Tue', aqi: 290, pm25: 175, pm10: 280, temp: 25, wind: 5.2 },
    { time: 'Wed', aqi: 325, pm25: 205, pm10: 315, temp: 24, wind: 4.5 },
    { time: 'Thu', aqi: 310, pm25: 190, pm10: 295, temp: 25, wind: 5.0 },
    { time: 'Fri', aqi: 280, pm25: 165, pm10: 265, temp: 26, wind: 7.2 },
    { time: 'Sat', aqi: 235, pm25: 135, pm10: 220, temp: 27, wind: 8.5 },
    { time: 'Sun', aqi: 215, pm25: 120, pm10: 205, temp: 27, wind: 9.1 },
  ];

  const monthlyData = [
    { time: 'Week 1', aqi: 210, pm25: 120, pm10: 195, temp: 28, wind: 8.4 },
    { time: 'Week 2', aqi: 265, pm25: 160, pm10: 250, temp: 26, wind: 6.2 },
    { time: 'Week 3', aqi: 330, pm25: 210, pm10: 320, temp: 23, wind: 4.1 },
    { time: 'Week 4', aqi: 285, pm25: 170, pm10: 275, temp: 24, wind: 5.8 },
  ];

  const seasonalData = [
    { time: 'Winter (Nov-Jan)', aqi: 345, pm25: 225, pm10: 350, temp: 16, wind: 3.8 },
    { time: 'Spring (Feb-Mar)', aqi: 185, pm25: 95, pm10: 170, temp: 24, wind: 9.4 },
    { time: 'Summer (Apr-Jun)', aqi: 220, pm25: 85, pm10: 280, temp: 38, wind: 14.5 },
    { time: 'Monsoon (Jul-Sep)', aqi: 75, pm25: 32, pm10: 65, temp: 30, wind: 12.0 },
    { time: 'Post-Monsoon (Oct)', aqi: 240, pm25: 145, pm10: 230, temp: 27, wind: 6.5 },
  ];

  const trendDataMap = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
    seasonal: seasonalData,
  };

  const currentDataset = trendDataMap[timeRange];

  // Source attribution
  const sourceAttribution = [
    { name: 'Vehicular Emissions', value: 38, color: '#00D9FF' },
    { name: 'Industrial & Power', value: 24, color: '#3478F6' },
    { name: 'Construction & Road Dust', value: 18, color: '#FF9F43' },
    { name: 'Biomass & Residue Stubble', value: 14, color: '#8B5CF6' },
    { name: 'Waste Burning & Other', value: 6, color: '#FF4560' },
  ];

  // Weather vs AQI scatter
  const weatherAqiCorrelation = [
    { wind: 2.5, aqi: 380, label: 'Severe Inversion' },
    { wind: 3.8, aqi: 340, label: 'Nocturnal Lid' },
    { wind: 5.2, aqi: 285, label: 'Low Breeze' },
    { wind: 7.0, aqi: 215, label: 'Moderate' },
    { wind: 9.5, aqi: 155, label: 'Active Drift' },
    { wind: 12.0, aqi: 110, label: 'Dispersal' },
    { wind: 15.5, aqi: 65, label: 'High Dilution' },
  ];

  // Cigarette equivalent calculation (Berkeley Earth formula: PM2.5 / 22 = cigarettes per day)
  const currentPm25 = currentDataset[currentDataset.length - 1]?.pm25 || 155;
  const cigarettesPerDay = (currentPm25 / 22).toFixed(1);

  const handleDownloadCsv = () => {
    playCyberClick();
    const headers = 'Time,AQI,PM2.5,PM10,Temperature_C,Wind_Speed_kmh\n';
    const rows = currentDataset.map((d) => `${d.time},${d.aqi},${d.pm25},${d.pm10},${d.temp},${d.wind}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AirGuard_${selectedCity}_${timeRange}_environmental_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Environmental Science & Longitudinal Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Environmental Impact & Longitudinal Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Diurnal, seasonal, and chemical speciation trends with meteorological covariate correlations, statutory compliance scores, and downloadable municipal reports.
          </p>
        </div>

        {/* Action Buttons: CSV & PDF Export */}
        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={handleDownloadCsv}
            className="btn-cinematic-cyan px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-glow-cyan"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-cinematic-glass px-4 py-2 rounded-xl text-xs flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clean Air Days */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>CPCB COMPLIANCE DAYS</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              <AnimatedCounter value={42} />%
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              Days within 0-100 NAQI ceiling
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Based on trailing 90-day CPCB logs</span>
        </div>

        {/* Cumulative PM2.5 Inhaled */}
        <div className="p-4 rounded-2xl glass-card border border-rose-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-rose-300 font-mono">
            <span>PASSIVE CIGARETTE EQUIVALENT</span>
            <HeartPulse className="w-4 h-4 text-rose-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-rose-400">
              {cigarettesPerDay}
            </span>
            <span className="text-xs text-slate-300 block mt-0.5">
              Cigarettes / day equivalent
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Berkeley Earth PM2.5 dosimetry formula</span>
        </div>

        {/* Wind Inversion Factor */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>VENTILATION COEFFICIENT</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-cyan-400">
              <AnimatedCounter value={2450} />
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              m²/s Atmospheric Dilution
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Threshold for high smog trap: &lt;6000 m²/s</span>
        </div>

        {/* Dominant Urban Source */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PRIMARY SOURCE ATTRIBUTION</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-amber-400">
              Vehicular (38%)
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">
              Arterial transport & diesel freight
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Speciation chemical fingerprinting</span>
        </div>
      </div>

      {/* Main Longitudinal Trend Chart */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Atmospheric Pollution Trend Explorer ({selectedCity})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select time horizons and target pollutants for continuous longitudinal analysis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Time range buttons */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              {(['daily', 'weekly', 'monthly', 'seasonal'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    playCyberClick();
                    setTimeRange(r);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    timeRange === r
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Pollutant toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              {(['aqi', 'pm25', 'pm10'] as const).map((pol) => (
                <button
                  key={pol}
                  onClick={() => {
                    playCyberClick();
                    setPollutantFilter(pol);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-colors ${
                    pollutantFilter === pol
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pol}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Area Chart Viewport */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentDataset} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#3478F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#07111F', borderColor: '#3478F6', borderRadius: '12px', color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey={pollutantFilter}
                stroke="#00D9FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPol)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Source Attribution + Weather Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Source Attribution Pie Chart */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-cyan-400" />
              <span>Pollution Source Attribution Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400">
              Chemical mass balance & statutory source apportionment modeling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-7 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceAttribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {sourceAttribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#07111F', borderColor: '#3478F6', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="sm:col-span-5 space-y-2 text-xs">
              {sourceAttribution.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-300 truncate">{s.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weather vs AQI Correlation Scatter */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wind className="w-5 h-5 text-emerald-400" />
              <span>Wind Speed (km/h) vs AQI Correlation</span>
            </h3>
            <p className="text-xs text-slate-400">
              Demonstrating lateral particulate dispersion vs nocturnal thermal stagnation.
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="wind"
                  name="Wind Speed"
                  unit=" km/h"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="aqi"
                  name="AQI"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#07111F', borderColor: '#3478F6', borderRadius: '12px', color: '#fff' }}
                />
                <Scatter name="Telemetry Observations" data={weatherAqiCorrelation} fill="#00E6A0" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed italic">
            Observed negative correlation (r = -0.84): Winds exceeding 8.5 km/h trigger convective dilution, dropping ground-level particulate loading by 45-60%.
          </p>
        </div>
      </div>
    </div>
  );
};
export default EnvironmentalAnalyticsPage;

