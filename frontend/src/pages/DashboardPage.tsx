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
  Crosshair,
  Sliders,
  HeartPulse,
  Activity,
  Layers,
  ShieldCheck,
  Radio,
  Flame
} from 'lucide-react';
import { CurrentSummary, City } from '../types';
import { StatCard } from '../components/StatCard';
import { AQIBadge } from '../components/AQIBadge';
import { AQIGauge } from '../components/AQIGauge';
import { ThreeDIcon } from '../components/ThreeDIcon';
import { ThreeDCard } from '../components/ThreeDCard';
import { CityRibbon } from '../components/CityRibbon';
import { HealthAdvisoryCard } from '../components/HealthAdvisoryCard';
import { CityComparisonModal } from '../components/CityComparisonModal';
import { SkeletonCard, SkeletonChart } from '../components/SkeletonLoader';
import { LiveAqiTicker } from '../components/LiveAqiTicker';
import { AtmosphericFlowfield3D } from '../components/AtmosphericFlowfield3D';
import { ExposureCalculatorModal } from '../components/ExposureCalculatorModal';
import { FluidWaveBanner } from '../components/FluidWaveBanner';
import { CitySlideShow } from '../components/CitySlideShow';
import { CinematicHeroSection } from '../components/CinematicHeroSection';
import { EnvironmentalMetricGrid } from '../components/EnvironmentalMetricGrid';
import { playCyberClick } from '../utils/audioSystem';

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
  onSelectStationForForecast,
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const [showExposureModal, setShowExposureModal] = useState(false);

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
  const primaryReading = summary.readings[0];
  const currentPm25 = primaryReading?.pm25 || 74.2;
  const currentPm10 = primaryReading?.pm10 || 128.5;
  const currentTemp = primaryReading?.temperature || 28.5;
  const currentWind = primaryReading?.wind_speed || 8.2;

  return (
    <div className="space-y-6">
      {/* Real-Time National Cities Ticker */}
      <LiveAqiTicker onSelectCity={onSelectCity} selectedCity={selectedCity} />

      {/* Cinematic Hero Section (Heading: INTELLIGENCE FOR A CLEANER TOMORROW) */}
      <CinematicHeroSection
        selectedCity={selectedCity}
        overallAqi={Math.round(summary.overall_aqi)}
        overallCategory={summary.overall_category}
        stationCount={summary.readings.length}
        pm25={currentPm25}
        pm10={currentPm10}
        temperature={currentTemp}
        windSpeed={currentWind}
        onExploreDashboard={() => {
          const el = document.getElementById('live-metrics-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onPredictFuture={() => onNavigate('forecast')}
      />

      {/* Live 11-Parameter Environmental Metric Grid */}
      <div id="live-metrics-grid">
        <EnvironmentalMetricGrid
          reading={primaryReading}
          overallAqi={summary.overall_aqi}
          overallCategory={summary.overall_category}
          lastUpdated={new Date(summary.last_updated).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })}
          cityName={selectedCity}
        />
      </div>

      {/* Quick City Navigation Ribbon */}
      <CityRibbon
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
      />

      {/* Hero Animated Watery Flow Telemetry Banner */}
      <FluidWaveBanner
        selectedCity={selectedCity}
        stationCount={summary.readings.length}
        overallAqi={Math.round(summary.overall_aqi)}
        onNavigate={onNavigate}
        onOpenExposureModal={() => setShowExposureModal(true)}
      />

      {/* Overview Radar Speedometer + Quick Command Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 glass-panel border border-cyan-500/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop decorative orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Overview & Description */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Real-Time Atmospheric Intelligence Core</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {selectedCity === 'All' ? 'National Smart Cities Overview' : `${selectedCity} Microclimate`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Synthesizing continuous ambient observations across {summary.readings.length} CAAQMS statutory towers with boundary-layer meteorology.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
                Reporting Nodes
              </span>
              <div className="text-xl font-black text-white mt-0.5">
                {summary.readings.length} Stations
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">100% Online</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
                Dominant Stressor
              </span>
              <div className="text-xl font-black text-cyan-400 mt-0.5 uppercase font-mono">
                PM2.5 / PM10
              </div>
              <span className="text-[11px] text-slate-400">Micro-particulates</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
                Risk Classification
              </span>
              <div className="text-xl font-black text-white mt-0.5 truncate">
                {summary.overall_category}
              </div>
              <span className="text-[11px] text-slate-400">CPCB NAQI Scale</span>
            </div>
          </div>

          {/* Action Launchpad Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                playCyberClick();
                onNavigate('map');
              }}
              className="btn-cinematic-cyan px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>3D City Map</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                onNavigate('hotspots');
              }}
              className="btn-cinematic-glass px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:text-rose-400"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Pollution Hotspots</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                onNavigate('comparison');
              }}
              className="btn-cinematic-glass px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>City Comparison</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                onNavigate('assistant');
              }}
              className="btn-cinematic-glass px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:text-purple-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>ECO AI Copilot</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                onNavigate('analytics');
              }}
              className="btn-cinematic-glass px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Longitudinal Analytics</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                setShowExposureModal(true);
              }}
              className="btn-cinematic-glass px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:text-rose-300"
            >
              <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Inhaled Dose</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Synced: {new Date(summary.last_updated).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
          </div>
        </div>

        {/* Right Side: Speedometer Radial Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 z-10">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
            Air Quality Speedometer
          </div>
          <AQIGauge aqi={summary.overall_aqi} category={summary.overall_category} size={280} />
          <div className="text-center mt-3 text-xs text-slate-400 max-w-xs font-sans">
            Statutory Central Pollution Control Board (CPCB) Standard
          </div>
        </div>
      </div>

      {/* Featured Indian City Intelligence Carousel */}
      <CitySlideShow
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
      />

      {/* Citizen Health & Actionable Advisories */}
      <HealthAdvisoryCard aqi={summary.overall_aqi} category={summary.overall_category} />

      {/* 4 KPI Cards Row with Parallax Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ThreeDCard glowColor="emerald" tiltStrength={10} depth={20}>
          <div className="glass-card p-5 rounded-2xl border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Cleanest Zone
                </span>
                <ThreeDIcon name="leaf" size="sm" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                  {cleanest ? Math.round(cleanest.aqi) : '—'}
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">AQI</span>
              </div>
              <div className="text-xs text-slate-300 font-semibold truncate mt-2">
                {cleanest ? cleanest.station_name : '—'}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">{cleanest?.city || 'India'}</span>
              {cleanest && <AQIBadge category={cleanest.category} size="sm" showNumber={false} />}
            </div>
          </div>
        </ThreeDCard>

        <ThreeDCard glowColor="rose" tiltStrength={10} depth={20}>
          <div className="glass-card p-5 rounded-2xl border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Highest Pollution Peak
                </span>
                <ThreeDIcon name="alert" size="sm" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-rose-400 tracking-tight">
                  {highest ? Math.round(highest.aqi) : '—'}
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">AQI</span>
              </div>
              <div className="text-xs text-slate-300 font-semibold truncate mt-2">
                {highest ? highest.station_name : 'No active alerts'}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">{highest?.city || 'India'}</span>
              {highest && <AQIBadge category={highest.category} size="sm" showNumber={false} />}
            </div>
          </div>
        </ThreeDCard>

        <ThreeDCard glowColor="cyan" tiltStrength={10} depth={20}>
          <div className="glass-card p-5 rounded-2xl border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  AI Forecast Readiness
                </span>
                <ThreeDIcon name="ai" size="sm" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  7-Day
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">168h</span>
              </div>
              <div className="text-xs text-slate-300 font-semibold truncate mt-2">
                Quantile Uncertainty Active
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Confidence</span>
              <span className="text-cyan-400 font-mono font-bold">10th - 90th Pct</span>
            </div>
          </div>
        </ThreeDCard>

        <ThreeDCard glowColor={summary.active_alerts_count > 0 ? 'amber' : 'emerald'} tiltStrength={10} depth={20}>
          <div className="glass-card p-5 rounded-2xl border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Active Health Advisories
                </span>
                <ThreeDIcon name="lungs" size="sm" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-3xl font-extrabold tracking-tight ${summary.active_alerts_count > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {summary.active_alerts_count}
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">Active</span>
              </div>
              <div className="text-xs text-slate-300 font-semibold truncate mt-2">
                {summary.active_alerts_count > 0 ? 'Requires Operator Review' : 'All Clear / Safe'}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Status</span>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-cyan-400 font-bold hover:underline"
              >
                View Feed &rarr;
              </button>
            </div>
          </div>
        </ThreeDCard>
      </div>

      {/* 3D Atmospheric Wind & Particulate Flowfield Digital Twin */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThreeDIcon name="wind" size="sm" />
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                3D Atmospheric Particulate Dispersion Flowfield
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  WebGL Physics Simulation
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Live particle dispersal vector driven by real-time micro-climate wind covariates.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('scenario')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors hidden sm:flex"
          >
            Launch "What-If" Policy Studio &rarr;
          </button>
        </div>

        <AtmosphericFlowfield3D
          aqi={summary.overall_aqi}
          windSpeed={primaryReading?.wind_speed || 8.5}
          windDirection={190}
          temperature={primaryReading?.temperature || 26}
          height="360px"
        />
      </div>

      {/* Monitoring Stations Grid */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <span>Urban Monitoring Stations ({summary.readings.length})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Station-level pollutant breakdown across {selectedCity === 'All' ? 'major Indian municipal centers' : selectedCity}
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
              className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white truncate max-w-[190px]">
                      {reading.station_name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">{reading.city_name}</p>
                  </div>
                  <AQIBadge category={reading.aqi_category} aqi={reading.aqi} size="sm" />
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 font-mono">
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
                <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
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

      {/* Personal Respiratory Exposure Calculator Modal */}
      <ExposureCalculatorModal
        isOpen={showExposureModal}
        onClose={() => setShowExposureModal(false)}
        currentAqi={summary.overall_aqi}
        currentPm25={currentPm25}
        cityName={selectedCity === 'All' ? 'National Smart Cities' : selectedCity}
      />
    </div>
  );
};
export default DashboardPage;
