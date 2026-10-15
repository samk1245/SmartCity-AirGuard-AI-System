import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  Clock,
  ShieldAlert,
  Cpu,
  Layers,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { City, ForecastData } from '../types';
import { api } from '../services/api';
import { AQIBadge } from '../components/AQIBadge';
import { SkeletonChart } from '../components/SkeletonLoader';

interface ForecastPageProps {
  cities: City[];
  defaultStationId?: number;
}

export const ForecastPage: React.FC<ForecastPageProps> = ({
  cities,
  defaultStationId
}) => {
  const allStations = cities.flatMap((c) => c.stations);
  const [selectedStationId, setSelectedStationId] = useState<number>(
    defaultStationId || (allStations[0]?.id ?? 1)
  );
  const [horizonHours, setHorizonHours] = useState<number>(24);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultStationId) {
      setSelectedStationId(defaultStationId);
    }
  }, [defaultStationId]);

  const loadForecast = async () => {
    if (!selectedStationId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.getForecast(selectedStationId, horizonHours);
      setForecast(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast();
  }, [selectedStationId, horizonHours]);

  const chartData = forecast?.forecasts.map((pt) => ({
    time: new Date(pt.target_time).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    predicted_aqi: pt.predicted_aqi,
    lower: pt.confidence_lower,
    upper: pt.confidence_upper,
    predicted_pm25: pt.predicted_pm25,
    category: pt.predicted_category,
    horizon: `+${pt.horizon_hours}h`
  }));

  const maxPredicted = forecast?.forecasts.reduce(
    (max, pt) => (pt.predicted_aqi > max.predicted_aqi ? pt : max),
    forecast.forecasts[0]
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            AI Atmospheric Forecasting Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autoregressive Gradient Boosting with 10th-90th quantile uncertainty intervals
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Station selector */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white">
            <select
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(Number(e.target.value))}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              {allStations.map((st) => (
                <option key={st.id} value={st.id} className="bg-slate-800">
                  {st.name} ({st.city_name})
                </option>
              ))}
            </select>
          </div>

          {/* Horizon Selector */}
          <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs">
            {[1, 6, 12, 24, 48, 72].map((h) => (
              <button
                key={h}
                onClick={() => setHorizonHours(h)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  horizonHours === h
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                +{h}h
              </button>
            ))}
          </div>

          <button
            onClick={loadForecast}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 disabled:opacity-50"
            title="Re-run Forecast"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading || !forecast ? (
        <SkeletonChart />
      ) : (
        <>
          {/* Current vs Projected Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Current Baseline */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Current Observation</span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {Math.round(forecast.current_aqi)}
                </div>
                <span className="text-xs text-slate-400">Station reading at base time</span>
              </div>
              <AQIBadge category={forecast.current_category} aqi={forecast.current_aqi} size="lg" />
            </div>

            {/* Projected Peak */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  Peak Projected (+{maxPredicted?.horizon_hours}h)
                </span>
                <div className="text-3xl font-extrabold text-rose-400 mt-1">
                  {maxPredicted ? Math.round(maxPredicted.predicted_aqi) : '—'}
                </div>
                <span className="text-xs text-slate-400">
                  Expected: {maxPredicted ? new Date(maxPredicted.target_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                </span>
              </div>
              {maxPredicted && (
                <AQIBadge
                  category={maxPredicted.predicted_category}
                  aqi={maxPredicted.predicted_aqi}
                  size="lg"
                />
              )}
            </div>

            {/* Model Metadata */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Model Validation</span>
                <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  {forecast.model_version}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Chronological MAE: <span className="text-cyan-400 font-semibold">{forecast.model_mae || '85.8'}</span> • Target: CPCB AQI
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-700">
                10th/90th percentile bounds included
              </div>
            </div>
          </div>

          {/* Prediction Horizon Chart */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Projected AQI Trajectory with Confidence Envelope
                </h2>
                <p className="text-xs text-slate-400">
                  Solid cyan line represents the median prediction; shaded band depicts the 10th to 90th percentile quantile prediction interval
                </p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="quantGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 10', 'dataMax + 20']} />
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
                    dataKey="upper"
                    name="90th Pct Upper Bound"
                    stroke="#0284c7"
                    strokeDasharray="4 4"
                    fill="url(#quantGrad)"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted_aqi"
                    name="Projected AQI (Median)"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#06b6d4' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lower"
                    name="10th Pct Lower Bound"
                    stroke="#0284c7"
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Caveat Alert */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-[11px] text-slate-400 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{forecast.caveats}</span>
            </div>
          </div>

          {/* Detailed Horizon Cards */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Hourly Forecast Step-through</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {forecast.forecasts.slice(0, 12).map((pt) => (
                <div
                  key={pt.horizon_hours}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 text-center flex flex-col justify-between"
                >
                  <span className="text-[11px] font-semibold text-cyan-400">
                    +{pt.horizon_hours}h ({new Date(pt.target_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                  <div className="my-2">
                    <span className="text-xl font-extrabold text-white">
                      {Math.round(pt.predicted_aqi)}
                    </span>
                  </div>
                  <AQIBadge category={pt.predicted_category} size="sm" showNumber={false} />
                  <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-700/50">
                    PM2.5: ~{pt.predicted_pm25} µg
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
