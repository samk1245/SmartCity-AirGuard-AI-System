import React, { useState } from 'react';
import { Search, Sparkles, Filter, Droplets, Thermometer, Wind, RefreshCw } from 'lucide-react';
import { CurrentSummary } from '../types';
import { AQIBadge } from '../components/AQIBadge';

interface CurrentAirQualityPageProps {
  summary: CurrentSummary | null;
  loading: boolean;
  onSelectStationForForecast: (stationId: number) => void;
}

export const CurrentAirQualityPage: React.FC<CurrentAirQualityPageProps> = ({
  summary,
  loading,
  onSelectStationForForecast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  if (loading || !summary) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse">
        <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-cyan-400" />
        <p>Loading real-time station parameters...</p>
      </div>
    );
  }

  const filteredReadings = summary.readings.filter((r) => {
    const matchesSearch =
      r.station_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      categoryFilter === 'All' || r.aqi_category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Live Station Atmospheric Metrics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-pollutant concentrations (µg/m³) and CPCB NAQI break-downs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search station or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 w-56"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-800">All Categories</option>
              <option value="Good" className="bg-slate-800">Good (0-50)</option>
              <option value="Satisfactory" className="bg-slate-800">Satisfactory (51-100)</option>
              <option value="Moderate" className="bg-slate-800">Moderate (101-200)</option>
              <option value="Poor" className="bg-slate-800">Poor (201-300)</option>
              <option value="Very Poor" className="bg-slate-800">Very Poor (301-400)</option>
              <option value="Severe" className="bg-slate-800">Severe (401-500+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="px-5 py-3.5">Station & City</th>
                <th className="px-4 py-3.5">CPCB AQI</th>
                <th className="px-3 py-3.5">PM2.5</th>
                <th className="px-3 py-3.5">PM10</th>
                <th className="px-3 py-3.5">NO2</th>
                <th className="px-3 py-3.5">SO2</th>
                <th className="px-3 py-3.5">CO (mg)</th>
                <th className="px-3 py-3.5">O3</th>
                <th className="px-4 py-3.5">Weather</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredReadings.map((r) => (
                <tr key={r.station_id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-white text-sm">{r.station_name}</div>
                    <div className="text-slate-400 text-[11px]">{r.city_name}</div>
                  </td>
                  <td className="px-4 py-4">
                    <AQIBadge category={r.aqi_category} aqi={r.aqi} size="sm" />
                  </td>
                  <td className="px-3 py-4 font-mono font-semibold text-slate-200">
                    {r.pm25 !== undefined ? `${r.pm25}` : '—'}
                  </td>
                  <td className="px-3 py-4 font-mono font-semibold text-slate-200">
                    {r.pm10 !== undefined ? `${r.pm10}` : '—'}
                  </td>
                  <td className="px-3 py-4 font-mono text-slate-300">
                    {r.no2 !== undefined ? `${r.no2}` : '—'}
                  </td>
                  <td className="px-3 py-4 font-mono text-slate-300">
                    {r.so2 !== undefined ? `${r.so2}` : '—'}
                  </td>
                  <td className="px-3 py-4 font-mono text-slate-300">
                    {r.co !== undefined ? `${r.co}` : '—'}
                  </td>
                  <td className="px-3 py-4 font-mono text-slate-300">
                    {r.o3 !== undefined ? `${r.o3}` : '—'}
                  </td>
                  <td className="px-4 py-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      {r.temperature && (
                        <span className="flex items-center gap-0.5 text-slate-300">
                          <Thermometer className="w-3 h-3 text-cyan-400" />
                          {r.temperature}°
                        </span>
                      )}
                      {r.humidity && (
                        <span className="flex items-center gap-0.5 text-slate-300">
                          <Droplets className="w-3 h-3 text-cyan-400" />
                          {r.humidity}%
                        </span>
                      )}
                      {r.wind_speed && (
                        <span className="flex items-center gap-0.5 text-slate-300">
                          <Wind className="w-3 h-3 text-cyan-400" />
                          {r.wind_speed}km/h
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => onSelectStationForForecast(r.station_id)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/30 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Forecast
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReadings.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-slate-400">
                    No stations match your search query or category filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
