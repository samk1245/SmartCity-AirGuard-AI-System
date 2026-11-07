import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Wind, Thermometer, ArrowUpRight, Sparkles, Building2 } from 'lucide-react';
import { AQIBadge } from './AQIBadge';

interface CitySlideItem {
  name: string;
  state: string;
  tagline: string;
  landmark: string;
  estAqi: number;
  category: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  temp: number;
  bgGradient: string;
  accentColor: string;
}

const FEATURED_SLIDES: CitySlideItem[] = [
  {
    name: 'Delhi',
    state: 'Delhi NCR',
    tagline: 'National Capital Territory & River Yamuna Basin',
    landmark: 'India Gate & Central Vista',
    estAqi: 285,
    category: 'Poor',
    temp: 26,
    bgGradient: 'from-amber-950/60 via-slate-900 to-rose-950/60',
    accentColor: '#f97316',
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'Arabian Sea Coastal Megapolis',
    landmark: 'Gateway of India & Marine Drive',
    estAqi: 118,
    category: 'Moderate',
    temp: 30,
    bgGradient: 'from-cyan-950/60 via-slate-900 to-blue-950/60',
    accentColor: '#06b6d4',
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    tagline: 'Deccan Plateau Garden & Silicon Capital',
    landmark: 'Vidhana Soudha & Cubbon Canopy',
    estAqi: 62,
    category: 'Satisfactory',
    temp: 24,
    bgGradient: 'from-emerald-950/60 via-slate-900 to-teal-950/60',
    accentColor: '#10b981',
  },
  {
    name: 'Srinagar',
    state: 'Jammu and Kashmir',
    tagline: 'Kashmir Valley & Dal Lake Biosphere',
    landmark: 'Zabarwan Range & Shikara Boulevard',
    estAqi: 48,
    category: 'Good',
    temp: 14,
    bgGradient: 'from-teal-950/60 via-slate-900 to-emerald-950/60',
    accentColor: '#14b8a6',
  },
  {
    name: 'Shimla',
    state: 'Himachal Pradesh',
    tagline: 'Himalayan Ridge High Altitude Forest',
    landmark: 'Mall Road & Jakhu Pine Forest',
    estAqi: 32,
    category: 'Good',
    temp: 16,
    bgGradient: 'from-blue-950/60 via-slate-900 to-cyan-950/60',
    accentColor: '#38bdf8',
  },
  {
    name: 'Leh',
    state: 'Ladakh',
    tagline: 'Trans-Himalayan Cold Desert Pristine Haven',
    landmark: 'Shanti Stupa & Indus Basin',
    estAqi: 20,
    category: 'Good',
    temp: 8,
    bgGradient: 'from-indigo-950/60 via-slate-900 to-sky-950/60',
    accentColor: '#818cf8',
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    tagline: 'Aravalli Hills & Historic Pink Architecture',
    landmark: 'Hawa Mahal & Amber Fort Corridor',
    estAqi: 172,
    category: 'Moderate',
    temp: 29,
    bgGradient: 'from-orange-950/60 via-slate-900 to-amber-950/60',
    accentColor: '#f59e0b',
  },
  {
    name: 'Kolkata',
    state: 'West Bengal',
    tagline: 'Hooghly Estuary Cultural Heartland',
    landmark: 'Victoria Memorial & Howrah Bridge',
    estAqi: 165,
    category: 'Moderate',
    temp: 28,
    bgGradient: 'from-purple-950/60 via-slate-900 to-blue-950/60',
    accentColor: '#a855f7',
  },
];

interface CitySlideShowProps {
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
}

export const CitySlideShow: React.FC<CitySlideShowProps> = ({
  selectedCity,
  onSelectCity,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentSlide = FEATURED_SLIDES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + FEATURED_SLIDES.length) % FEATURED_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_SLIDES.length);
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden glass-watery-card border border-slate-700/80 p-6 shadow-2xl transition-all"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background slide ambient gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentSlide.bgGradient} opacity-60 transition-all duration-700 pointer-events-none`}
      />

      {/* Floating decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Slide Navigation Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Featured Indian City Intelligence Carousel
          </h3>
        </div>

        {/* Arrow slide buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-700 hover:border-cyan-400 flex items-center justify-center transition-all shadow-md active:scale-90"
            title="Previous City"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-700 hover:border-cyan-400 flex items-center justify-center transition-all shadow-md active:scale-90"
            title="Next City"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Slide Body */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-8 space-y-2 animate-slide-right">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-cyan-400 text-xs font-bold border border-cyan-800">
              {currentSlide.state}
            </span>
            <span className="text-xs text-slate-400 font-medium">{currentSlide.landmark}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{currentSlide.name}</span>
            {selectedCity === currentSlide.name && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700">
                Current Active Scope
              </span>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {currentSlide.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-slate-300">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentSlide.temp}°C Microclimate</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-slate-300">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>CPCB CAAQMS Grid</span>
            </div>

            <button
              onClick={() => onSelectCity(currentSlide.name)}
              className="btn-liquid-cyan px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
            >
              <span>Inspect {currentSlide.name} Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>

        {/* AQI Badge & Score Card */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-inner animate-slide-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Baseline Ambient AQI
          </span>
          <div className="text-4xl font-black text-white tracking-tight my-1">
            {currentSlide.estAqi}
          </div>
          <AQIBadge category={currentSlide.category} size="md" />
          <span className="text-[10px] text-slate-400 mt-2 font-mono">CPCB NAQI Standard</span>
        </div>
      </div>

      {/* Slide Indicators / Dots */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 mt-5">
        {FEATURED_SLIDES.map((slide, idx) => (
          <button
            key={slide.name}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
            }`}
            title={`Slide to ${slide.name}`}
          />
        ))}
      </div>
    </div>
  );
};
