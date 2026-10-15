import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { AlertSummary, AlertItem } from '../types';
import { api } from '../services/api';

export const AlertsPage: React.FC = () => {
  const [alertSummary, setAlertSummary] = useState<AlertSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [ackFilter, setAckFilter] = useState<boolean | undefined>(undefined);
  const [acknowledgingId, setAcknowledgingId] = useState<number | null>(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.getAlerts(
        severityFilter !== 'All' ? severityFilter : undefined,
        ackFilter
      );
      setAlertSummary(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [severityFilter, ackFilter]);

  const handleAcknowledge = async (id: number) => {
    try {
      setAcknowledgingId(id);
      await api.acknowledgeAlert(id);
      // Update local state
      setAlertSummary((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          total_unread: Math.max(0, prev.total_unread - 1),
          recent_alerts: prev.recent_alerts.map((a) =>
            a.id === id ? { ...a, is_acknowledged: true, acknowledged_at: new Date().toISOString() } : a
          )
        };
      });
    } catch (e) {
      console.error(e);
    } finally {
      setAcknowledgingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BellRing className="w-6 h-6 text-rose-400" />
            Smart Pollution Alerts & Health Advisories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated threshold violation detector with 4-hour cooldown suppression and operator acknowledgement
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-800">All Severities</option>
              <option value="Critical" className="bg-slate-800">Critical (AQI &gt; 400)</option>
              <option value="Danger" className="bg-slate-800">Danger (AQI &gt; 300)</option>
              <option value="Warning" className="bg-slate-800">Warning (AQI &gt; 200)</option>
            </select>
          </div>

          <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => setAckFilter(undefined)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                ackFilter === undefined ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setAckFilter(false)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                ackFilter === false ? 'bg-rose-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setAckFilter(true)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                ackFilter === true ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Acknowledged
            </button>
          </div>

          <button
            onClick={loadAlerts}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400"
            title="Refresh Alerts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Alert KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Unresolved Advisories</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {alertSummary?.total_unread || 0}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-rose-500/15 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Critical Level Alerts</span>
            <div className="text-2xl font-extrabold text-red-500 mt-1">
              {alertSummary?.critical_count || 0}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-red-950/40 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Warning Advisories</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">
              {alertSummary?.warning_count || 0}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/15 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alertSummary?.recent_alerts.map((alert) => {
          const isCritical = alert.severity === 'Critical';
          const isDanger = alert.severity === 'Danger';
          const badgeClass = isCritical
            ? 'bg-red-900/30 text-red-400 border-red-700/50'
            : isDanger
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
            : 'bg-amber-500/20 text-amber-400 border-amber-500/40';

          return (
            <div
              key={alert.id}
              className={`bg-slate-800/80 border rounded-2xl p-5 shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                alert.is_acknowledged
                  ? 'border-slate-800 opacity-70'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${badgeClass}`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {alert.station_name}, {alert.city_name}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.triggered_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed">{alert.message}</p>

                <div className="text-xs text-slate-400 flex items-center gap-3 pt-1">
                  <span>
                    Measured Value: <span className="text-cyan-400 font-semibold">{Math.round(alert.measured_value)} AQI</span>
                  </span>
                  <span>•</span>
                  <span>
                    Threshold: <span className="text-slate-300">{alert.threshold_value} AQI</span>
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                {alert.is_acknowledged ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
                    <CheckCircle2 className="w-4 h-4" /> Acknowledged
                  </div>
                ) : (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={acknowledgingId === alert.id}
                    className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow"
                  >
                    {acknowledgingId === alert.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    Acknowledge Alert
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {alertSummary?.recent_alerts.length === 0 && (
          <div className="p-12 text-center bg-slate-800/40 rounded-2xl border border-slate-700/50 text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
            <p className="font-semibold text-white">No alerts match the selected criteria</p>
            <p className="text-xs mt-1">Air pollution levels are within operational limits or suppressed under cooldown.</p>
          </div>
        )}
      </div>
    </div>
  );
};
