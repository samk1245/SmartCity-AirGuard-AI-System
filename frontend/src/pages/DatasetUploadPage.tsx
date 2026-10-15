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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-cyan-400" />
          Historical Dataset Upload & Ingestion Pipeline
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Validate and import historical air quality CSV records with automatic schema validation, deduplication, and CPCB AQI recalculation
        </p>
      </div>

      {/* Drag & Drop Upload Card */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 shadow-xl text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Select or drop a CSV dataset</h3>
            <p className="text-xs text-slate-400 mt-1">
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
            <span className="inline-block px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs cursor-pointer border border-slate-600 transition-colors">
              Browse CSV Files
            </span>
          </label>

          {file && (
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 flex items-center justify-between text-xs text-left">
              <div className="flex items-center gap-2 text-slate-300 truncate">
                <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{file.name}</span>
                <span className="text-slate-500">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
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
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            Dataset Validated & Ingested Successfully
          </div>
          <p className="text-xs text-slate-300">{result.validation_notes}</p>
          <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t border-emerald-900/50">
            <div>
              <span className="text-slate-400">Imported Records:</span>
              <div className="text-emerald-400 font-bold text-base">{result.imported_count}</div>
            </div>
            <div>
              <span className="text-slate-400">Skipped (Duplicate):</span>
              <div className="text-slate-300 font-bold text-base">{result.skipped_count}</div>
            </div>
            <div>
              <span className="text-slate-400">Total Processed:</span>
              <div className="text-cyan-400 font-bold text-base">{result.total_rows_processed}</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-6 shadow-xl flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
          <div>
            <div className="font-bold text-rose-400 mb-1">Dataset Rejected</div>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Schema Format Reference */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            Expected CSV Format & Schema Specification
          </h3>
          <a
            href="/api/data/export"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Download Standard Sample Template
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Column Name</th>
                <th className="py-2.5 px-3">Requirement</th>
                <th className="py-2.5 px-3">Units / Expected Format</th>
                <th className="py-2.5 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 text-slate-300">
              <tr>
                <td className="py-2 px-3 font-mono text-cyan-400">timestamp</td>
                <td className="py-2 px-3 text-rose-400 font-bold">Required</td>
                <td className="py-2 px-3">ISO 8601 / YYYY-MM-DD HH:MM</td>
                <td className="py-2 px-3">Observation timestamp</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-cyan-400">station_code</td>
                <td className="py-2 px-3 text-rose-400 font-bold">Required</td>
                <td className="py-2 px-3">String (e.g. DEL-AV-01, PRY-CL-01)</td>
                <td className="py-2 px-3">Monitoring station unique identifier</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-cyan-400">pm25</td>
                <td className="py-2 px-3 text-slate-400">Optional</td>
                <td className="py-2 px-3">µg/m³ (0 - 2000)</td>
                <td className="py-2 px-3">Particulate matter &le; 2.5 micrometers</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-cyan-400">pm10</td>
                <td className="py-2 px-3 text-slate-400">Optional</td>
                <td className="py-2 px-3">µg/m³ (0 - 3000)</td>
                <td className="py-2 px-3">Particulate matter &le; 10 micrometers</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-cyan-400">no2, so2, co, o3</td>
                <td className="py-2 px-3 text-slate-400">Optional</td>
                <td className="py-2 px-3">µg/m³ (CO in mg/m³)</td>
                <td className="py-2 px-3">Gaseous pollutants</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-cyan-400">temperature, humidity, wind_speed</td>
                <td className="py-2 px-3 text-slate-400">Optional</td>
                <td className="py-2 px-3">°C, %, km/h</td>
                <td className="py-2 px-3">Meteorological covariates for ML</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
