import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Sparkles,
  Download,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';
import { ScoreboardItem } from '../types';

interface ScoreboardPageProps {
  onSelectCity: (cityName: string) => void;
  onNavigateToMap: (lat: number, lng: number) => void;
}

export const ScoreboardPage: React.FC<ScoreboardPageProps> = ({
  onSelectCity,
  onNavigateToMap
}) => {
  const [scoreboard, setScoreboard] = useState<ScoreboardItem[]>([]);
  const [sortBy, setSortBy] = useState<'worst' | 'best'>('worst');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchScoreboard = async (mode: 'worst' | 'best') => {
    try {
      setLoading(true);
      const res = await api.getScoreboard(20, mode);
      setScoreboard(res.scoreboard);
    } catch (err) {
      console.error('Failed to load scoreboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScoreboard(sortBy);
  }, [sortBy]);

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#84cc16';
    if (aqi <= 200) return '#f59e0b';
    if (aqi <= 300) return '#f97316';
    if (aqi <= 400) return '#ef4444';
    return '#7f1d1d';
  };

  const handleExportCSV = () => {
    if (!scoreboard.length) return;
    const headers = ['Rank', 'City', 'State', 'Average AQI', 'Category', 'Station Count', 'Coverage'];
    const rows = scoreboard.map((item, index) => [
      index + 1,
      `"${item.city}"`,
      `"${item.state}"`,
      item.average_aqi,
      item.category,
      item.station_count,
      `"${item.data_coverage}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `india_aqi_scoreboard_${sortBy}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl glass-panel bg-forest-950/70 border border-emerald-500/25 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-mint-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-mint-400 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
              <Trophy className="w-4 h-4" />
              National Environmental Rankings
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              India Air Quality Scoreboard
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Composite ranking of Indian municipal centers based on aggregated real-time CAAQMS telemetry.
              Filter between highest pollution hotspots and pristine urban havens.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="btn-cinematic-emerald flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-glow-emerald"
            >
              <Download className="w-4 h-4" />
              Export Scoreboard CSV
            </button>
          </div>
        </div>

        {/* Toggle Mode Ribbon */}
        <div className="mt-6 pt-5 border-t border-emerald-900/40 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 bg-forest-950 p-1.5 rounded-xl border border-emerald-900/50 text-xs">
            <button
              onClick={() => setSortBy('worst')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                sortBy === 'worst'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Highest Pollution Hotspots (Worst AQI)
            </button>
            <button
              onClick={() => setSortBy('best')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                sortBy === 'best'
                  ? 'bg-emerald-500 text-forest-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              Cleanest Urban Havens (Best AQI)
            </button>
          </div>

          <span className="text-xs text-mint-400 font-mono hidden sm:inline-block">
            Verified CAAQMS Data Coverage
          </span>
        </div>
      </div>

      {/* Scoreboard Table */}
      <div className="rounded-3xl glass-panel bg-forest-950/70 border border-emerald-900/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-forest-900/90 border-b border-emerald-900/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-16">Rank</th>
                <th className="py-3.5 px-4">City & State</th>
                <th className="py-3.5 px-4 text-center">Composite AQI</th>
                <th className="py-3.5 px-4">CPCB Status</th>
                <th className="py-3.5 px-4 text-center">Station Density</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-4">
                      <div className="h-6 bg-forest-900/60 rounded" />
                    </td>
                  </tr>
                ))
              ) : scoreboard.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No scoreboard records found.
                  </td>
                </tr>
              ) : (
                scoreboard.map((item, idx) => (
                  <tr
                    key={item.city}
                    className="hover:bg-forest-900/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white group-hover:text-mint-300 transition">
                        {item.city}
                      </div>
                      <div className="text-xs text-slate-400">{item.state}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className="inline-block text-base font-black px-3 py-1 rounded-xl"
                        style={{
                          backgroundColor: `${getAqiColor(item.average_aqi)}20`,
                          color: getAqiColor(item.average_aqi),
                          border: `1px solid ${getAqiColor(item.average_aqi)}40`
                        }}
                      >
                        {item.average_aqi}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-slate-300">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-900 text-mint-300 border border-emerald-900/60 font-mono">
                        {item.station_count} station{item.station_count > 1 ? 's' : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectCity(item.city)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-mint-400 text-xs font-semibold transition"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => onNavigateToMap(item.latitude, item.longitude)}
                          className="p-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-slate-300 hover:text-white border border-emerald-900/50 transition"
                          title="View on Map"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
