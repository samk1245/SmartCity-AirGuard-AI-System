import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  Droplets,
  Thermometer,
  Wind,
  ArrowRightLeft,
  Share2,
  Download,
  Globe,
  Compass,
  Crosshair
} from 'lucide-react';
import { CurrentSummary, City } from '../types';
import { StatCard } from '../components/StatCard';
import { AQIBadge } from '../components/AQIBadge';
import { AQIGauge } from '../components/AQIGauge';
import { ThreeDIcon } from '../components/ThreeDIcon';
import { CityRibbon } from '../components/CityRibbon';
import { HealthAdvisoryCard } from '../components/HealthAdvisoryCard';
import { CityComparisonModal } from '../components/CityComparisonModal';
import { SkeletonCard, SkeletonChart } from '../components/SkeletonLoader';

interface DashboardPageProps {
  summary: CurrentSummary | null;
  loading: boolean;
  selectedCity: string;
  cities: City[];
  onSelectCity: (city: string) => void;
  onNavigate: (tab: any) => void;
  onSelectStationForForecast: (stationId: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  loading,
  selectedCity,
  cities,
  onSelectCity,
  onNavigate,
  onSelectStationForForecast
}) => {
  const [showComparison, setShowComparison] = useState(false);

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
      {/* Quick City Navigation Ribbon */}
      <CityRibbon
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
      />

      {/* Hero Visual Dashboard: Radial Speedometer + Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop decorative orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Overview & Description */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              Real-Time Atmospheric Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {selectedCity === 'All' ? 'National Smart Cities AQI' : `${selectedCity} Air Quality`}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Monitoring ambient particulates, gaseous pollutants, and micro-climatic atmospheric variations across statutory Indian CPCB stations.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Reporting Nodes
              </span>
              <div className="text-xl font-black text-white mt-0.5">
                {summary.readings.length} Stations
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">100% Online</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Dominant Agent
              </span>
              <div className="text-xl font-black text-cyan-400 mt-0.5 uppercase">
                PM2.5 / PM10
              </div>
              <span className="text-[11px] text-slate-400">Micro-particulates</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Risk Classification
              </span>
              <div className="text-xl font-black text-white mt-0.5 truncate">
                {summary.overall_category}
              </div>
              <span className="text-[11px] text-slate-400">CPCB NAQI Scale</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={() => onNavigate('earth3d')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-[1.02] transition-all"
            >
              <Globe className="w-4 h-4 text-slate-950" /> 3D Earth Globe
            </button>

            <button
              onClick={() => onNavigate('streetview')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:scale-[1.02] transition-all"
            >
              <Crosshair className="w-4 h-4 text-slate-950" /> Street View (Live GPS)
            </button>

            <button
              onClick={() => onNavigate('forecast')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-cyan-800/60 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" /> AI Forecast
            </button>

            <button
              onClick={() => setShowComparison(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" /> Compare
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> GIS Map
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Last Synced: {new Date(summary.last_updated).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </div>
        </div>

        {/* Right Side: Animated 3D Radial Speedometer Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80 z-10">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Air Quality Gauge
          </div>
          <AQIGauge aqi={summary.overall_aqi} category={summary.overall_category} size={290} />
          <div className="text-center mt-3 text-xs text-slate-400 max-w-xs">
            Official Indian Central Pollution Control Board (CPCB) Standard
          </div>
        </div>
      </div>

      {/* Citizen Health & Actionable Advisories */}
      <HealthAdvisoryCard aqi={summary.overall_aqi} category={summary.overall_category} />

      {/* KPI Cards Row with 3D Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg backdrop-blur-sm hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Cleanest Zone
            </span>
            <ThreeDIcon name="leaf" size="sm" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              {cleanest ? Math.round(cleanest.aqi) : '—'}
            </span>
            <span className="text-xs font-medium text-slate-400">AQI</span>
          </div>
          <div className="text-xs text-slate-300 font-semibold truncate mt-2">
            {cleanest ? cleanest.station_name : '—'}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
            <span className="text-slate-400">{cleanest?.city || 'India'}</span>
            {cleanest && <AQIBadge category={cleanest.category} size="sm" showNumber={false} />}
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg backdrop-blur-sm hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Highest Pollution Peak
            </span>
            <ThreeDIcon name="alert" size="sm" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-rose-400 tracking-tight">
              {highest ? Math.round(highest.aqi) : '—'}
            </span>
            <span className="text-xs font-medium text-slate-400">AQI</span>
          </div>
          <div className="text-xs text-slate-300 font-semibold truncate mt-2">
            {highest ? highest.station_name : 'No active alerts'}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
            <span className="text-slate-400">{highest?.city || 'India'}</span>
            {highest && <AQIBadge category={highest.category} size="sm" showNumber={false} />}
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg backdrop-blur-sm hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI Forecast Readiness
            </span>
            <ThreeDIcon name="ai" size="sm" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              72h
            </span>
            <span className="text-xs font-medium text-slate-400">Horizon</span>
          </div>
          <div className="text-xs text-slate-300 font-semibold truncate mt-2">
            Quantile Uncertainty Active
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
            <span className="text-slate-400">Confidence</span>
            <span className="text-cyan-400 font-bold">10th - 90th Pct</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg backdrop-blur-sm hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Health Advisories
            </span>
            <ThreeDIcon name="lungs" size="sm" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-3xl font-extrabold tracking-tight ${summary.active_alerts_count > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {summary.active_alerts_count}
            </span>
            <span className="text-xs font-medium text-slate-400">Active</span>
          </div>
          <div className="text-xs text-slate-300 font-semibold truncate mt-2">
            {summary.active_alerts_count > 0 ? 'Requires Operator Review' : 'All Clear / Safe'}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
            <span className="text-slate-400">Status</span>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-cyan-400 font-bold hover:underline"
            >
              View Feed &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Monitoring Stations Matrix */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ThreeDIcon name="wind" size="sm" />
              Urban Monitoring Stations ({summary.readings.length})
            </h2>
            <p className="text-xs text-slate-400">
              Station-level pollutant breakdown across {selectedCity === 'All' ? '15 Indian cities' : selectedCity}
            </p>
          </div>
          <button
            onClick={() => onNavigate('live')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            Detailed Metrics Table <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.readings.slice(0, 9).map((reading) => (
            <div
              key={reading.station_id}
              className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600 transition-all flex flex-col justify-between"
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

                <div className="grid grid-cols-3 gap-2 my-3 text-[11px] bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
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

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-800 text-xs">
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
                  className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Forecast
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-City Comparison Modal */}
      <CityComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        cities={cities}
        currentCity={selectedCity}
      />
    </div>
  );
};
