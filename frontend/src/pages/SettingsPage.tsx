import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Bell, Database, Save, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [warningThreshold, setWarningThreshold] = useState('200');
  const [dangerThreshold, setDangerThreshold] = useState('300');
  const [criticalThreshold, setCriticalThreshold] = useState('400');
  const [cooldownHours, setCooldownHours] = useState('4');
  const [openaqKey, setOpenaqKey] = useState('');
  const [weatherKey, setWeatherKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          System Settings & Data-Source Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tune environmental alert thresholds, notification cooldowns, and external API integrations
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Configuration preferences saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Alert Thresholds Card */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-400" />
            Air Quality Alert Thresholds (CPCB NAQI)
          </h3>
          <p className="text-xs text-slate-400">
            Define triggers for automated public-health warnings and administrative alerts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Advisory Warning (AQI)
              </label>
              <input
                type="number"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 200 (Poor)</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Danger Warning (AQI)
              </label>
              <input
                type="number"
                value={dangerThreshold}
                onChange={(e) => setDangerThreshold(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 300 (Very Poor)</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Critical Emergency (AQI)
              </label>
              <input
                type="number"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 400 (Severe)</span>
            </div>
          </div>

          <div className="pt-2 text-xs">
            <label className="block text-slate-300 font-semibold mb-1">
              Alert Suppression Cooldown Window (Hours)
            </label>
            <input
              type="number"
              value={cooldownHours}
              onChange={(e) => setCooldownHours(e.target.value)}
              className="w-48 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Prevents duplicate notification spam within this interval.
            </span>
          </div>
        </div>

        {/* External API Keys Card */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            External Data Integration Keys (Optional)
          </h3>
          <p className="text-xs text-slate-400">
            SmartCity AirGuard operates offline with bundled realistic monitoring station datasets. You can optionally connect live external APIs.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                OpenAQ API Key
              </label>
              <input
                type="password"
                placeholder="Leave blank for local sample mode"
                value={openaqKey}
                onChange={(e) => setOpenaqKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                OpenWeatherMap / Weather API Key
              </label>
              <input
                type="password"
                placeholder="Leave blank for local sample mode"
                value={weatherKey}
                onChange={(e) => setWeatherKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Database & Retention */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-3 text-xs">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            Storage & Database Engine
          </h3>
          <p className="text-slate-300">
            Active Storage: <span className="font-mono text-cyan-400">SQLite (local development)</span>
          </p>
          <p className="text-slate-400">
            Observations are indexed on composite <span className="font-mono text-slate-300">(station_id, timestamp)</span> for rapid time-slice queries. For high-throughput production, configure PostgreSQL via <span className="font-mono text-slate-300">DATABASE_URL</span> in <span className="font-mono text-slate-300">.env</span>.
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </form>
    </div>
  );
};
