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
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <LineChartIcon className="w-6 h-6 text-cyan-400" />
            Historical Air Quality Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pandas-driven time-series aggregation, Pearson pollutant correlations, and seasonal high-risk episodes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Station selector */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white">
            <select
              value={selectedStationId || ''}
              onChange={(e) =>
                setSelectedStationId(e.target.value ? Number(e.target.value) : undefined)
              }
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-800">
                All Stations ({selectedCity})
              </option>
              {availableStations.map((st) => (
                <option key={st.id} value={st.id} className="bg-slate-800">
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Aggregation interval */}
          <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs">
            {['hourly', 'daily', 'weekly', 'monthly'].map((freq) => (
              <button
                key={freq}
                onClick={() => setAggregation(freq)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  aggregation === freq
                    ? 'bg-cyan-500 text-slate-950 font-bold'
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
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  Multi-Pollutant Trajectory ({aggregation.toUpperCase()})
                </h2>
                <p className="text-xs text-slate-400">
                  CPCB AQI, PM2.5, and PM10 concentrations over time
                </p>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {analytics.total_records.toLocaleString()} total sample observations
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.trend_data}>
                  <defs>
                    <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="avg_aqi"
                    name="Avg AQI"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#aqiGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="avg_pm25"
                    name="Avg PM2.5 (µg/m³)"
                    stroke="#f43f5e"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#pm25Grad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="avg_pm10"
                    name="Avg PM10 (µg/m³)"
                    stroke="#eab308"
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
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Descriptive Statistical Distribution
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Variable</th>
                      <th className="py-2.5 px-3">Mean</th>
                      <th className="py-2.5 px-3">Median</th>
                      <th className="py-2.5 px-3">Min</th>
                      <th className="py-2.5 px-3">Max</th>
                      <th className="py-2.5 px-3">Std Dev</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40">
                    {Object.entries(analytics.summary_statistics).map(([param, stats]) => (
                      <tr key={param} className="hover:bg-slate-700/20">
                        <td className="py-2.5 px-3 font-semibold text-white uppercase">{param}</td>
                        <td className="py-2.5 px-3 text-cyan-400 font-mono">{stats.mean}</td>
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
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
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
                                ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                                : isPositive
                                ? `rgba(6, 182, 212, ${intensity * 0.4})`
                                : `rgba(244, 63, 94, ${intensity * 0.4})`;

                            return (
                              <td
                                key={colP}
                                className="p-1.5 font-mono text-[10px] rounded border border-slate-800"
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
