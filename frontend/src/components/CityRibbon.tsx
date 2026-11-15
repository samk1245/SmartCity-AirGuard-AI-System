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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border backdrop-blur-md cursor-pointer ${
            selectedCity === 'All'
              ? 'bg-gradient-to-r from-emerald-500 to-mint-400 text-forest-950 border-mint-300 shadow-glow-emerald scale-[1.02]'
              : 'glass-card text-slate-300 border-emerald-500/20 hover:border-emerald-400/40 hover:text-white'
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
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all border backdrop-blur-md cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500 to-mint-400 text-forest-950 border-mint-300 shadow-glow-emerald scale-[1.02] font-bold'
                  : 'glass-card text-slate-300 border-emerald-500/20 hover:border-emerald-400/40 hover:text-white'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-forest-950' : 'text-emerald-400'}`} />
              <div className="text-left">
                <div className="leading-tight">{city.name}</div>
                <div className={`text-[9px] uppercase tracking-wider font-mono ${isSelected ? 'text-forest-900' : 'text-slate-400'}`}>
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
