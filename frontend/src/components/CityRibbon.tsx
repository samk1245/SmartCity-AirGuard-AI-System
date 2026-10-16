import React from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import { City } from '../types';

interface CityRibbonProps {
  cities: City[];
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
}

export const CityRibbon: React.FC<CityRibbonProps> = ({
  cities,
  selectedCity,
  onSelectCity
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 pt-1 no-scrollbar">
      <div className="flex items-center gap-2.5 min-w-max">
        {/* All Cities Chip */}
        <button
          onClick={() => onSelectCity('All')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
            selectedCity === 'All'
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 border-transparent shadow-lg shadow-cyan-500/25 scale-[1.02]'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All India ({cities.length} Cities)</span>
        </button>

        {cities.map((city) => {
          const isSelected = selectedCity === city.name;
          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(city.name)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 border-transparent shadow-lg shadow-cyan-500/25 scale-[1.02] font-bold'
                  : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
              <div className="text-left">
                <div className="leading-tight">{city.name}</div>
                <div className={`text-[9px] uppercase tracking-wider ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                  {city.state} • {city.stations.length} stns
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
