import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Building2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  BarChart2,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { StateSummary, StateCityInfo, IndiaCitySearchResult } from '../types';

interface CityExplorerPageProps {
  onSelectCity: (cityName: string) => void;
  onNavigateToMap: (lat: number, lng: number) => void;
  onNavigateToStreetView: (lat: number, lng: number, name: string) => void;
}

export const CityExplorerPage: React.FC<CityExplorerPageProps> = ({
  onSelectCity,
  onNavigateToMap,
  onNavigateToStreetView
}) => {
  const [states, setStates] = useState<StateSummary[]>([]);
  const [selectedState, setSelectedState] = useState<string>('Delhi');
  const [stateCities, setStateCities] = useState<StateCityInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IndiaCitySearchResult[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean>(true);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'monitored' | 'unmonitored'>('all');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const res = await api.getStates();
        setStates(res.states);
      } catch (err) {
        console.error('Failed to load Indian states:', err);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedState) return;
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const res = await api.getCitiesByState(selectedState);
        setStateCities(res.cities);
      } catch (err) {
        console.error('Failed to load cities for state:', err);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedState]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await api.searchIndiaCities(query, 25);
      setSearchResults(res.results);
    } catch (err) {
      console.error('City search failed:', err);
    }
  };

  const filteredCities = stateCities.filter((c) => {
    if (activeFilter === 'monitored') return c.has_monitoring_station;
    if (activeFilter === 'unmonitored') return !c.has_monitoring_station;
    return true;
  });

  const selectedStateObj = states.find((s) => s.state === selectedState);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              National Geographic Directory
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              India City & State Explorer
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Comprehensive environmental registry covering all 28 States and 8 Union Territories.
              Track continuous CAAQMS sensor deployments, urban centroids, and district telemetry coverage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="block text-xs text-slate-400 uppercase font-semibold">States & UTs</span>
              <span className="text-xl font-black text-cyan-400">36</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="block text-xs text-slate-400 uppercase font-semibold">Monitored Hubs</span>
              <span className="text-xl font-black text-emerald-400">65+</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-6 relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search across all Indian cities, districts, or states (e.g., Lucknow, Bengaluru, Pune)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Mode */}
      {isSearching && searchQuery.trim().length >= 2 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              Search Results for <strong className="text-cyan-400">"{searchQuery}"</strong> ({searchResults.length} found)
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 transition"
            >
              Back to State Browser
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No Indian cities or districts matched your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((city, idx) => (
                <div
                  key={`${city.name}-${city.state}-${idx}`}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                          {city.name}
                        </h4>
                        <p className="text-xs text-slate-400">{city.state}</p>
                      </div>
                      {city.has_monitoring_station ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> CAAQMS
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          Satellite Modeled
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSelectCity(city.name)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <BarChart2 className="w-3.5 h-3.5" /> View Dashboard
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateToMap(city.latitude, city.longitude)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="View on Map"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onNavigateToStreetView(city.latitude, city.longitude, `${city.name}, ${city.state}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Open Street View"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* State & City Dual Navigation View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: State Selection List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                States & Union Territories ({states.length})
              </span>
            </div>

            <div className="max-h-[640px] overflow-y-auto space-y-1.5 pr-1">
              {loadingStates ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-900/60 rounded-xl animate-pulse border border-slate-800" />
                ))
              ) : (
                states.map((st) => {
                  const isSelected = selectedState === st.state;
                  return (
                    <button
                      key={st.state}
                      onClick={() => setSelectedState(st.state)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-950/40 font-semibold'
                          : 'bg-slate-900/80 border border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="text-sm font-semibold truncate">{st.state}</div>
                        <div className="text-[11px] text-slate-500 truncate">Cap: {st.capital}</div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {st.monitored_cities}/{st.total_cities} stns
                        </span>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Cities in Selected State */}
          <div className="lg:col-span-8 space-y-4">
            {selectedStateObj && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[10px]">
                      {selectedStateObj.type}
                    </span>
                    <span>Capital: {selectedStateObj.capital}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-1">{selectedState}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedStateObj.monitored_cities} of {selectedStateObj.total_cities} documented cities have active CPCB CAAQMS air quality monitoring towers.
                  </p>
                </div>

                {/* Filter toggle */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({stateCities.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter('monitored')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeFilter === 'monitored' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monitored
                  </button>
                  <button
                    onClick={() => setActiveFilter('unmonitored')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeFilter === 'unmonitored' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Modeled
                  </button>
                </div>
              </div>
            )}

            {/* City Grid */}
            {loadingCities ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-32 bg-slate-900 rounded-xl animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
                <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No cities matched the active filter for {selectedState}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCities.map((city) => (
                  <div
                    key={city.name}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                            {city.name}
                          </h3>
                          <span className="text-xs text-slate-500">{selectedState}</span>
                        </div>
                        {city.has_monitoring_station ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> CAAQMS Online
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            Modeled Satellite
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-3">
                        <span>Lat: {city.latitude.toFixed(2)}° N</span>
                        <span>Lng: {city.longitude.toFixed(2)}° E</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <button
                        onClick={() => onSelectCity(city.name)}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Select for Analysis
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigateToMap(city.latitude, city.longitude)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Center on 2D GIS Map"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigateToStreetView(city.latitude, city.longitude, `${city.name}, ${selectedState}`)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Open 360° Street View"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
