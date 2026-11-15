import React from 'react';

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
        return 'text-emerald-300 bg-forest-950/90 border-emerald-500/40';
      case 'Satisfactory':
        return 'text-lime-300 bg-forest-950/90 border-lime-500/40';
      case 'Moderate':
        return 'text-amber-300 bg-forest-950/90 border-amber-500/40';
      case 'Poor':
        return 'text-orange-300 bg-forest-950/90 border-orange-500/40';
      case 'Very Poor':
        return 'text-rose-300 bg-forest-950/90 border-rose-500/40';
      default:
        return 'text-red-400 bg-forest-950/90 border-red-500/40';
    }
  };

  // Duplicate list to achieve infinite seamless marquee loop
  const tickerItems = [...NATIONAL_CITIES, ...NATIONAL_CITIES];

  return (
    <div className="relative w-full glass-panel border border-emerald-500/20 rounded-2xl overflow-hidden shadow-glass backdrop-blur-xl">
      <div className="flex items-center">
        {/* Fixed Left Badge with Emerald Beacon */}
        <div className="z-20 bg-gradient-to-r from-forest-950 via-forest-900 to-transparent pl-4 pr-6 py-2.5 flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-glow-emerald" />
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-mint-400 whitespace-nowrap font-mono">
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
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-mint-400 text-forest-950 font-black border-mint-300 shadow-glow-emerald scale-105'
                      : 'bg-forest-950/80 hover:bg-forest-900/90 border-emerald-500/20 text-slate-300 hover:text-white hover:border-emerald-400/40'
                  }`}
                >
                  <span className={isSelected ? 'text-forest-950' : 'text-white'}>
                    {item.city}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${
                      isSelected ? 'bg-forest-950 text-mint-300 border-forest-800' : getCategoryColor(item.category)
                    }`}
                  >
                    {item.aqi} • {item.category}
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
