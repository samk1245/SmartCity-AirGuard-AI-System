import React, { useState, useEffect } from 'react';
import {
  LineChart as LineChartIcon,
  Download,
  Calendar,
  Layers,
  Flame,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { HistoricalAnalytics, City } from '../types';
import { api } from '../services/api';
import { SkeletonChart } from '../components/SkeletonLoader';

interface HistoricalAnalyticsPageProps {
  cities: City[];
  selectedCity: string;
}

export const HistoricalAnalyticsPage: React.FC<HistoricalAnalyticsPageProps> = ({
  cities,
  selectedCity
}) => {
  const [analytics, setAnalytics] = useState<HistoricalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [aggregation, setAggregation] = useState('daily');
  const [selectedStationId, setSelectedStationId] = useState<number | undefined>(undefined);

  const availableStations =
    selectedCity === 'All'
      ? cities.flatMap((c) => c.stations)
      : cities.find((c) => c.name === selectedCity)?.stations || [];

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getHistoricalSummary(
        selectedStationId,
        selectedCity !== 'All' ? selectedCity : undefined,
        aggregation
      );
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCity, selectedStationId, aggregation]);

  const exportUrl = api.getExportUrl(
    selectedStationId,
    selectedCity !== 'All' ? selectedCity : undefined
  );

  return (
    <div className="space-y-6 animate-page-entrance">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel bg-forest-950/70 border border-emerald-500/25 shadow-spatial-glass relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-mint-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900/90 border border-emerald-500/40 text-mint-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <LineChartIcon className="w-3.5 h-3.5 text-mint-400" />
            <span>Time-Series Analytics Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            Historical Air Quality Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-normal">
            Pandas-driven time-series aggregation, Pearson pollutant correlations, and seasonal high-risk episodes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {/* Station selector */}
          <div className="bg-forest-950/90 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs text-white backdrop-blur-md">
            <select
              value={selectedStationId || ''}
              onChange={(e) =>
                setSelectedStationId(e.target.value ? Number(e.target.value) : undefined)
              }
              className="bg-transparent text-white focus:outline-none cursor-pointer font-medium"
            >
              <option value="" className="bg-forest-950 text-white">
                All Stations ({selectedCity})
              </option>
              {availableStations.map((st) => (
                <option key={st.id} value={st.id} className="bg-forest-950 text-white">
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Aggregation interval */}
          <div className="flex bg-forest-950/90 border border-emerald-500/30 rounded-xl p-1 text-xs backdrop-blur-md">
            {['hourly', 'daily', 'weekly', 'monthly'].map((freq) => (
              <button
                key={freq}
                onClick={() => setAggregation(freq)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                  aggregation === freq
                    ? 'bg-emerald-500 text-forest-950 font-bold shadow-glow-emerald'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>

          {/* CSV Export */}
          <a
            href={exportUrl}
            download="airguard_historical_export.csv"
            className="px-3.5 py-1.5 rounded-xl bg-forest-900/90 hover:bg-forest-800 border border-emerald-500/30 text-mint-300 text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-glass"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </a>
        </div>
      </div>

      {loading || !analytics ? (
        <SkeletonChart />
      ) : (
        <>
          {/* Main Trend Chart */}
          <div className="glass-panel border border-emerald-500/20 rounded-3xl p-6 lg:p-8 shadow-spatial-glass relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-emerald-500/20 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Multi-Pollutant Trajectory ({aggregation.toUpperCase()})
                </h2>
                <p className="text-xs text-slate-400">
                  CPCB AQI, PM2.5, and PM10 concentrations over time
                </p>
              </div>
              <div className="text-xs text-mint-300/80 font-mono font-medium px-3 py-1 rounded-full bg-forest-950/80 border border-emerald-500/30">
                {analytics.total_records.toLocaleString()} total sample observations
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.trend_data}>
                  <defs>
                    <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0a2417" />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#04120b',
                      borderColor: '#10B981',
                      borderRadius: '1rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.8), 0 0 20px rgba(16,185,129,0.25)',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="avg_aqi"
                    name="Avg AQI"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#aqiGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="avg_pm25"
                    name="Avg PM2.5 (µg/m³)"
                    stroke="#34D399"
                    strokeWidth={1.8}
                    fillOpacity={1}
                    fill="url(#pm25Grad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="avg_pm10"
                    name="Avg PM10 (µg/m³)"
                    stroke="#A7F3D0"
                    strokeWidth={1.5}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistical Breakdown & Correlations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Summary Statistics Table */}
            <div className="glass-panel border border-emerald-500/20 rounded-3xl p-6 shadow-spatial-glass">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Descriptive Statistical Distribution
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-forest-950/80 text-slate-300 border-b border-emerald-900/40 font-mono">
                    <tr>
                      <th className="py-2.5 px-3">Variable</th>
                      <th className="py-2.5 px-3">Mean</th>
                      <th className="py-2.5 px-3">Median</th>
                      <th className="py-2.5 px-3">Min</th>
                      <th className="py-2.5 px-3">Max</th>
                      <th className="py-2.5 px-3">Std Dev</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/30">
                    {Object.entries(analytics.summary_statistics).map(([param, stats]) => (
                      <tr key={param} className="hover:bg-emerald-900/20 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-white uppercase">{param}</td>
                        <td className="py-2.5 px-3 text-mint-300 font-mono">{stats.mean}</td>
                        <td className="py-2.5 px-3 text-slate-300 font-mono">{stats.median}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-mono">{stats.min}</td>
                        <td className="py-2.5 px-3 text-rose-400 font-mono">{stats.max}</td>
                        <td className="py-2.5 px-3 text-slate-400 font-mono">±{stats.std}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pollutant Correlation Heatmap */}
            <div className="glass-panel border border-emerald-500/20 rounded-3xl p-6 shadow-spatial-glass">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                Pollutant & Meteorological Correlation Matrix
              </h3>
              {analytics.correlations && (
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="p-1.5 text-left text-slate-400"></th>
                        {analytics.correlations.pollutants.slice(0, 6).map((p) => (
                          <th key={p} className="p-1.5 text-slate-300 uppercase font-semibold">
                            {p}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.correlations.pollutants.slice(0, 6).map((rowP) => (
                        <tr key={rowP}>
                          <td className="p-1.5 text-left font-semibold text-slate-300 uppercase">
                            {rowP}
                          </td>
                          {analytics.correlations?.pollutants.slice(0, 6).map((colP) => {
                            const val = analytics.correlations?.matrix[rowP]?.[colP] ?? 0;
                            const isPositive = val > 0;
                            const intensity = Math.abs(val);
                            const bg =
                              val === 1
                                ? 'bg-emerald-500/20 text-mint-300 font-bold'
                                : isPositive
                                ? `rgba(16, 185, 129, ${intensity * 0.45})`
                                : `rgba(244, 63, 94, ${intensity * 0.4})`;

                            return (
                              <td
                                key={colP}
                                className="p-1.5 font-mono text-[10px] rounded border border-emerald-950/60"
                                style={{ backgroundColor: val === 1 ? undefined : bg }}
                              >
                                {val.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!analytics.correlations && (
                <p className="text-xs text-slate-400">Insufficient points for correlation analysis.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
