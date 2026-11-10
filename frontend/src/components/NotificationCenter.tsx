import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
  Check,
  RefreshCw
} from 'lucide-react';
import { AlertItem, AlertSummary } from '../types';
import { api } from '../services/api';
import { playCyberClick } from '../utils/audioSystem';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAlerts: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigateToAlerts,
}) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.getAlerts();
      if (res && res.recent_alerts) {
        setAlerts(res.recent_alerts);
      }
    } catch (e) {
      // Fallback sample alerts if offline
      setAlerts([
        {
          id: 101,
          station_id: 1,
          city_name: 'Delhi',
          station_name: 'Anand Vihar Tower',
          severity: 'Critical',
          alert_type: 'PM2.5 Statutory Spike',
          pollutant: 'PM2.5',
          measured_value: 382,
          threshold_value: 300,
          message: 'Atmospheric PM2.5 exceeded critical statutory emergency threshold (382 µg/m³). Deploy water mist suppressants immediately.',
          triggered_at: new Date().toISOString(),
          is_acknowledged: false,
        },
        {
          id: 102,
          station_id: 2,
          city_name: 'Lucknow',
          station_name: 'Talkatora Industrial',
          severity: 'Warning',
          alert_type: 'Nocturnal Thermal Inversion',
          pollutant: 'PBL',
          measured_value: 268,
          threshold_value: 200,
          message: 'Boundary layer compressed to 280m with wind <4 km/h. High smog retention anticipated overnight.',
          triggered_at: new Date(Date.now() - 3600000).toISOString(),
          is_acknowledged: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen]);

  const handleAcknowledge = async (id: number) => {
    try {
      playCyberClick();
      await api.acknowledgeAlert(id).catch(() => null);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_acknowledged: true } : a))
      );
    } catch (e) {
      // Ignore
    }
  };

  const handleMarkAllRead = () => {
    playCyberClick();
    setAlerts((prev) => prev.map((a) => ({ ...a, is_acknowledged: true })));
  };

  if (!isOpen) return null;

  const unreadCount = alerts.filter((a) => !a.is_acknowledged).length;

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'Critical':
      case 'Danger':
        return 'text-rose-400 bg-rose-500/15 border-rose-500/40';
      case 'Warning':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/40';
      default:
        return 'text-cyan-400 bg-cyan-500/15 border-cyan-500/40';
    }
  };

  return (
    <div
      className="absolute right-0 top-14 w-80 sm:w-96 rounded-3xl glass-panel border border-cyan-500/40 shadow-2xl z-50 overflow-hidden shadow-glow-cyan animate-in fade-in duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Environmental Alert Dispatch
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white">
              {unreadCount} NEW
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Alerts list */}
      <div className="max-h-[380px] overflow-y-auto p-3 space-y-2.5">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Syncing CPCB alert stream...</span>
          </div>
        ) : alerts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
            <span>Zero critical environmental alerts active.</span>
          </div>
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              className={`p-3 rounded-2xl border transition-all ${
                a.is_acknowledged
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/90 border-slate-700/80 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border uppercase font-mono ${getSeverityStyle(
                      a.severity
                    )}`}
                  >
                    {a.severity}
                  </span>
                  <span className="text-[11px] font-bold text-white">
                    {a.city_name}
                  </span>
                </div>

                {!a.is_acknowledged ? (
                  <button
                    onClick={() => handleAcknowledge(a.id)}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    title="Mark as acknowledged"
                  >
                    <Check className="w-3 h-3" />
                    <span>Ack</span>
                  </button>
                ) : (
                  <span className="text-[9px] text-slate-500 font-mono">Read</span>
                )}
              </div>

              <p className="text-xs text-slate-200 mt-1.5 leading-relaxed font-sans">
                {a.message}
              </p>

              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{a.station_name}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {new Date(a.triggered_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-900/95 border-t border-slate-800 text-center">
        <button
          onClick={() => {
            playCyberClick();
            onNavigateToAlerts();
            onClose();
          }}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center justify-center gap-1.5 w-full"
        >
          <span>View Full Health Advisory & Alert Center</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
export default NotificationCenter;

