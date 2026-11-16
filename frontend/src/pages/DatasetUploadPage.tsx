import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck2,
  AlertCircle,
  FileText,
  Download,
  CheckCircle2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

export const DatasetUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.endsWith('.csv')) {
        setError('Only valid CSV files (.csv) are accepted.');
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setError(null);
      const res = await api.uploadDataset(file);
      setResult(res);
      if (!res.success) {
        setError(res.error || 'Upload was rejected by validation engine.');
      }
    } catch (err: any) {
      setError(err.message || 'Dataset upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-page-entrance">
      <div className="p-6 rounded-3xl glass-panel bg-forest-950/70 border border-emerald-500/25 shadow-spatial-glass relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-mint-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900/90 border border-emerald-500/40 text-mint-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <UploadCloud className="w-3.5 h-3.5 text-mint-400" />
            <span>Data Ingestion Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            Dataset Ingestion Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-normal">
            Validate and import historical air quality CSV records with automatic schema validation, deduplication, and CPCB AQI recalculation
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Card */}
      <div className="glass-panel border border-emerald-500/25 rounded-3xl p-8 sm:p-10 shadow-spatial-glass text-center relative overflow-hidden">
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-20 w-20 mx-auto rounded-3xl bg-forest-900/90 border border-emerald-500/40 flex items-center justify-center text-mint-400 shadow-glow-emerald">
            <UploadCloud className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Select or drop a CSV dataset</h3>
            <p className="text-xs text-slate-300 mt-1">
              Supports continuous ambient monitoring station exports up to 25 MB
            </p>
          </div>

          <label className="block">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="inline-block px-6 py-3 rounded-2xl btn-cinematic-glass text-white font-bold text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-glass">
              Browse CSV Files
            </span>
          </label>

          {file && (
            <div className="p-4 bg-forest-950/90 rounded-2xl border border-emerald-500/40 flex items-center justify-between text-xs text-left shadow-glass">
              <div className="flex items-center gap-2 text-slate-200 truncate">
                <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate font-medium">{file.name}</span>
                <span className="text-slate-400 font-mono">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn-cinematic-emerald px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileCheck2 className="w-3.5 h-3.5" />}
                Ingest Dataset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Validation Result Modal / Banner */}
      {result && result.success && (
        <div className="glass-panel border border-emerald-500/40 rounded-3xl p-6 shadow-glow-emerald space-y-3">
          <div className="flex items-center gap-2 text-mint-300 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Dataset Validated & Ingested Successfully
          </div>
          <p className="text-xs text-slate-300">{result.validation_notes}</p>
          <div className="grid grid-cols-3 gap-3 text-xs pt-3 border-t border-emerald-500/20 font-mono">
            <div>
              <span className="text-slate-400">Imported Records:</span>
              <div className="text-emerald-400 font-black text-lg">{result.imported_count}</div>
            </div>
            <div>
              <span className="text-slate-400">Skipped (Duplicate):</span>
              <div className="text-slate-300 font-black text-lg">{result.skipped_count}</div>
            </div>
            <div>
              <span className="text-slate-400">Total Processed:</span>
              <div className="text-mint-300 font-black text-lg">{result.total_rows_processed}</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="glass-panel border border-rose-500/40 rounded-3xl p-6 shadow-glow-red flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
          <div>
            <div className="font-bold text-rose-400 mb-1">Dataset Rejected</div>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Schema Format Reference */}
      <div className="glass-panel border border-emerald-500/25 rounded-3xl p-6 lg:p-8 shadow-spatial-glass space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Expected CSV Format & Schema Specification
          </h3>
          <a
            href="/api/data/export"
            className="text-xs text-mint-400 hover:text-mint-300 font-semibold flex items-center gap-1 font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download Standard Sample Template
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-950/80 text-slate-300 border-b border-emerald-900/40 font-mono">
              <tr>
                <th className="py-2.5 px-3">Column Name</th>
                <th className="py-2.5 px-3">Requirement</th>
                <th className="py-2.5 px-3">Units / Expected Format</th>
                <th className="py-2.5 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30 text-slate-300">
              <tr>
                <td className="py-2 px-3 font-mono text-mint-400 font-semibold">timestamp</td>
                <td className="py-2 px-3 text-rose-400 font-bold">Required</td>
                <td className="py-2 px-3 font-mono">ISO 8601 / YYYY-MM-DD HH:MM</td>
                <td className="py-2 px-3">Observation timestamp</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-mint-400 font-semibold">station_code</td>
                <td className="py-2 px-3 text-rose-400 font-bold">Required</td>
                <td className="py-2 px-3 font-mono">String (e.g. DEL-AV-01, PRY-CL-01)</td>
                <td className="py-2 px-3">Monitoring station unique identifier</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-mint-400 font-semibold">pm25</td>
                <td className="py-2 px-3 text-slate-400">Optional</td>
                <td className="py-2 px-3 font-mono">µg/m³ (0 - 2000)</td>
                <td className="py-2 px-3">Particulate matter &le; 2.5 micrometers</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-mint-400 font-semibold">pm10</td>
                <td className="py-2 px-3 text-slate-400">Optional</td>
                <td className="py-2 px-3 font-mono">µg/m³ (0 - 3000)</td>
                <td className="py-2 px-3">Particulate matter &le; 10 micrometers</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-mint-400 font-semibold">no2, so2, co, o3</td>
                <td className="py-2 px-3 text-slate-400">Optional</td>
                <td className="py-2 px-3 font-mono">µg/m³ (CO in mg/m³)</td>
                <td className="py-2 px-3">Gaseous pollutants</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-mint-400 font-semibold">temperature, humidity, wind_speed</td>
                <td className="py-2 px-3 text-slate-400">Optional</td>
                <td className="py-2 px-3 font-mono">°C, %, km/h</td>
                <td className="py-2 px-3">Meteorological covariates for ML</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
