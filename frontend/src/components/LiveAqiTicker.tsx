import React from 'react';
import { Activity, Flame, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

interface CityAqiTickerItem {
  city: string;
  state: string;
  aqi: number;
  category: string;
  dominant: string;
}

interface LiveAqiTickerProps {
  onSelectCity: (city: string) => void;
  selectedCity: string;
}

const NATIONAL_CITIES: CityAqiTickerItem[] = [
  { city: 'Delhi', state: 'Delhi', aqi: 285, category: 'Poor', dominant: 'PM2.5' },
  { city: 'Lucknow', state: 'UP', aqi: 215, category: 'Poor', dominant: 'PM2.5' },
  { city: 'Prayagraj', state: 'UP', aqi: 195, category: 'Moderate', dominant: 'PM10' },
  { city: 'Kanpur', state: 'UP', aqi: 220, category: 'Poor', dominant: 'PM2.5' },
  { city: 'Varanasi', state: 'UP', aqi: 175, category: 'Moderate', dominant: 'PM2.5' },
  { city: 'Mumbai', state: 'Maharashtra', aqi: 138, category: 'Moderate', dominant: 'PM10' },
  { city: 'Bengaluru', state: 'Karnataka', aqi: 82, category: 'Satisfactory', dominant: 'PM2.5' },
  { city: 'Kolkata', state: 'West Bengal', aqi: 182, category: 'Moderate', dominant: 'PM2.5' },
  { city: 'Hyderabad', state: 'Telangana', aqi: 94, category: 'Satisfactory', dominant: 'PM10' },
  { city: 'Ahmedabad', state: 'Gujarat', aqi: 162, category: 'Moderate', dominant: 'PM2.5' },
  { city: 'Jaipur', state: 'Rajasthan', aqi: 170, category: 'Moderate', dominant: 'PM10' },
  { city: 'Patna', state: 'Bihar', aqi: 240, category: 'Poor', dominant: 'PM2.5' },
  { city: 'Agra', state: 'UP', aqi: 188, category: 'Moderate', dominant: 'PM2.5' },
  { city: 'Pune', state: 'Maharashtra', aqi: 110, category: 'Moderate', dominant: 'PM10' },
  { city: 'Chandigarh', state: 'Punjab', aqi: 125, category: 'Moderate', dominant: 'PM2.5' },
];

export const LiveAqiTicker: React.FC<LiveAqiTickerProps> = ({
  onSelectCity,
  selectedCity,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Good':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
      case 'Satisfactory':
        return 'text-lime-400 bg-lime-950/80 border-lime-800';
      case 'Moderate':
        return 'text-yellow-400 bg-yellow-950/80 border-yellow-800';
      case 'Poor':
        return 'text-orange-400 bg-orange-950/80 border-orange-800';
      case 'Very Poor':
        return 'text-rose-400 bg-rose-950/80 border-rose-800';
      default:
        return 'text-red-400 bg-red-950/80 border-red-800';
    }
  };

  // Duplicate list to achieve infinite seamless marquee loop
  const tickerItems = [...NATIONAL_CITIES, ...NATIONAL_CITIES];

  return (
    <div className="relative w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
      <div className="flex items-center">
        {/* Fixed Left Badge */}
        <div className="z-20 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent pl-4 pr-6 py-2.5 flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400 whitespace-nowrap">
            Live NAQI Feed
          </span>
        </div>

        {/* Scrolling Ticker Strip */}
        <div className="flex overflow-hidden py-1.5 w-full mask-gradient">
          <div className="flex items-center gap-3 animate-ticker whitespace-nowrap">
            {tickerItems.map((item, index) => {
              const isSelected = selectedCity.toLowerCase() === item.city.toLowerCase();
              return (
                <button
                  key={`${item.city}-${index}`}
                  onClick={() => onSelectCity(item.city)}
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-black border-cyan-400 shadow-md shadow-cyan-500/30 scale-105'
                      : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className={isSelected ? 'text-slate-950' : 'text-white'}>
                    {item.city}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${
                      isSelected ? 'bg-slate-950 text-cyan-300 border-slate-800' : getCategoryColor(item.category)
                    }`}
                  >
                    AQI {item.aqi}
                  </span>
                  <span className={`text-[10px] ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                    {item.dominant}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
