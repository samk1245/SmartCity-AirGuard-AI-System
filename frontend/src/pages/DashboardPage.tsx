import React from 'react';
import {
  Wind,
  ShieldAlert,
  MapPin,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  Droplets,
  Thermometer
} from 'lucide-react';
import { CurrentSummary, Station } from '../types';
import { StatCard } from '../components/StatCard';
import { AQIBadge } from '../components/AQIBadge';
import { SkeletonCard, SkeletonChart } from '../components/SkeletonLoader';

interface DashboardPageProps {
  summary: CurrentSummary | null;
  loading: boolean;
  selectedCity: string;
  onNavigate: (tab: any) => void;
  onSelectStationForForecast: (stationId: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  loading,
  selectedCity,
  onNavigate,
  onSelectStationForForecast
}) => {
  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonChart />
      </div>
    );
  }

  const highest = summary.highest_polluted_station;
  const cleanest = summary.cleanest_station;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950/40 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Live Environmental Monitor
          </div>
          <h1 className="text-2xl font-black text-white">
            {selectedCity === 'All' ? 'National Urban Centers AQI' : `${selectedCity} Air Quality Index`}
          </h1>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Last Synced: {new Date(summary.last_updated).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} • Attribution: CPCB National Network
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-700/60 rounded-xl px-5 py-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Composite AQI</div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {Math.round(summary.overall_aqi)}
            </div>
          </div>
          <AQIBadge category={summary.overall_category} aqi={summary.overall_aqi} size="lg" />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Hotspots"
          value={highest ? Math.round(highest.aqi) : '—'}
          unit="AQI"
          subtitle={highest ? `${highest.station_name}` : 'No active alerts'}
          icon={AlertTriangle}
          accentColor="text-rose-400"
          badge={highest && <AQIBadge category={highest.category} size="sm" showNumber={false} />}
          trend={highest ? { direction: 'up', text: `Max: ${highest.pollutant.toUpperCase()}` } : undefined}
        />

        <StatCard
          title="Cleanest Zone"
          value={cleanest ? Math.round(cleanest.aqi) : '—'}
          unit="AQI"
          subtitle={cleanest ? `${cleanest.station_name}` : '—'}
          icon={Wind}
          accentColor="text-emerald-400"
          badge={cleanest && <AQIBadge category={cleanest.category} size="sm" showNumber={false} />}
          trend={cleanest ? { direction: 'down', text: 'Lowest AQI' } : undefined}
        />

        <StatCard
          title="Active Monitoring Nodes"
          value={summary.readings.length}
          subtitle={`Reporting across ${selectedCity === 'All' ? '5 smart cities' : selectedCity}`}
          icon={MapPin}
          accentColor="text-cyan-400"
        />

        <StatCard
          title="Active Risk Advisories"
          value={summary.active_alerts_count}
          subtitle={summary.active_alerts_count > 0 ? 'Pending operator review' : 'All clear'}
          icon={ShieldAlert}
          accentColor={summary.active_alerts_count > 0 ? 'text-amber-400' : 'text-slate-400'}
          badge={
            summary.active_alerts_count > 0 ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                Action Req.
              </span>
            ) : undefined
          }
        />
      </div>

      {/* Quick Station Grid */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Monitoring Stations Air Quality
            </h2>
            <p className="text-xs text-slate-400">
              Real-time multi-pollutant concentrations and CPCB risk status
            </p>
          </div>
          <button
            onClick={() => onNavigate('live')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            Detailed Metrics <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.readings.slice(0, 9).map((reading) => (
            <div
              key={reading.station_id}
              className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white truncate max-w-[190px]">
                      {reading.station_name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{reading.city_name}</p>
                  </div>
                  <AQIBadge category={reading.aqi_category} aqi={reading.aqi} size="sm" />
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 text-[11px] bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <div className="text-slate-400">PM2.5</div>
                    <div className="font-bold text-slate-200">
                      {reading.pm25 !== undefined ? `${reading.pm25} µg` : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">PM10</div>
                    <div className="font-bold text-slate-200">
                      {reading.pm10 !== undefined ? `${reading.pm10} µg` : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">NO2</div>
                    <div className="font-bold text-slate-200">
                      {reading.no2 !== undefined ? `${reading.no2} µg` : '—'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  {reading.temperature && (
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-cyan-400" />
                      {reading.temperature}°C
                    </span>
                  )}
                  {reading.humidity && (
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" />
                      {reading.humidity}%
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onSelectStationForForecast(reading.station_id)}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Forecast
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
