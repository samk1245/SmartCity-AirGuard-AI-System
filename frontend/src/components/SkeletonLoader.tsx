import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-slate-700 rounded w-1/3" />
      <div className="h-8 w-8 bg-slate-700 rounded-lg" />
    </div>
    <div className="h-8 bg-slate-700 rounded w-1/2 mb-3" />
    <div className="h-3 bg-slate-700/60 rounded w-2/3" />
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 animate-pulse">
    <div className="h-5 bg-slate-700 rounded w-1/4 mb-6" />
    <div className="h-64 bg-slate-700/40 rounded-lg flex items-end p-4 gap-2">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-700/60 rounded-t flex-1"
          style={{ height: `${20 + (i * 5) % 70}%` }}
        />
      ))}
    </div>
  </div>
);
