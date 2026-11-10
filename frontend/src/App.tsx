import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { AtmosphericCanvas } from './components/AtmosphericCanvas';
import { EcoAIAssistant } from './components/EcoAIAssistant';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Existing Pages
import { DashboardPage } from './pages/DashboardPage';
import { CurrentAirQualityPage } from './pages/CurrentAirQualityPage';
import { HistoricalAnalyticsPage } from './pages/HistoricalAnalyticsPage';
import { ForecastPage } from './pages/ForecastPage';
import { MapPage } from './pages/MapPage';
import { AlertsPage } from './pages/AlertsPage';
import { DatasetUploadPage } from './pages/DatasetUploadPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { Earth3DPage } from './pages/Earth3DPage';
import { StreetViewPage } from './pages/StreetViewPage';
import { ScenarioStudioPage } from './pages/ScenarioStudioPage';
import { CityExplorerPage } from './pages/CityExplorerPage';
import { PollutantAnalyticsPage } from './pages/PollutantAnalyticsPage';
import { HealthRecommendationsPage } from './pages/HealthRecommendationsPage';
import { NearbyAirQualityPage } from './pages/NearbyAirQualityPage';
import { ScoreboardPage } from './pages/ScoreboardPage';
import { TravelAirCheckPage } from './pages/TravelAirCheckPage';
import { PlumeSimulatorPage } from './pages/PlumeSimulatorPage';
import { EcoShieldPage } from './pages/EcoShieldPage';

// New Premium Pages
import { PollutionHotspotsPage } from './pages/PollutionHotspotsPage';
import { CityComparisonPage } from './pages/CityComparisonPage';
import { EnvironmentalAnalyticsPage } from './pages/EnvironmentalAnalyticsPage';
import { EcoAIPage } from './pages/EcoAIPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { ReportsPage } from './pages/ReportsPage';

import { City, CurrentSummary } from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [summary, setSummary] = useState<CurrentSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [forecastStationId, setForecastStationId] = useState<number | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Cross-page navigation state for Street View
  const [streetViewTarget, setStreetViewTarget] = useState<{
    lat: number;
    lng: number;
    name: string;
  }>({
    lat: 28.6129,
    lng: 77.2295,
    name: 'India Gate, New Delhi',
  });
  const [streetViewAutoLocate, setStreetViewAutoLocate] = useState<boolean>(false);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [locs, sum] = await Promise.all([
        api.getLocations(),
        api.getCurrentAirQuality(selectedCity !== 'All' ? selectedCity : undefined),
      ]);
      setCities(locs);
      setSummary(sum);
    } catch (err) {
      console.error('Failed to load initial application state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [selectedCity]);

  // Global Keyboard Shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const sum = await api.getCurrentAirQuality(
        selectedCity !== 'All' ? selectedCity : undefined
      );
      setSummary(sum);
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectStationForForecast = (stationId: number) => {
    setForecastStationId(stationId);
    setCurrentTab('forecast');
  };

  const handleNavigateToStreetView = (lat: number, lng: number, name: string) => {
    setStreetViewAutoLocate(false);
    setStreetViewTarget({ lat, lng, name });
    setCurrentTab('streetview');
  };

  const handleNavigateToCurrentLocationStreetView = () => {
    setStreetViewAutoLocate(true);
    setCurrentTab('streetview');
  };

  const handleNavigateToMap = (lat: number, lng: number) => {
    setCurrentTab('map');
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const primaryReading = summary?.readings[0];

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden ${
        theme === 'light' ? 'light bg-slate-100 text-slate-900' : 'bg-midnight-950 text-slate-100'
      }`}
    >
      {/* Background Animated Atmospheric Particles */}
      <AtmosphericCanvas aqi={summary ? summary.overall_aqi : 120} />

      {/* Global Quick Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        cities={cities}
        onSelectCity={(city) => {
          setSelectedCity(city);
          setCurrentTab('dashboard');
        }}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Floating ECO AI Copilot Assistant */}
      <EcoAIAssistant
        selectedCity={selectedCity === 'All' ? 'National Smart Cities' : selectedCity}
        currentAqi={summary ? Math.round(summary.overall_aqi) : 135}
        currentCategory={summary ? summary.overall_category : 'Moderate'}
        pm25={primaryReading?.pm25 || 74.2}
        pm10={primaryReading?.pm10 || 128.5}
        temperature={primaryReading?.temperature || 28.5}
        humidity={primaryReading?.humidity || 58.0}
        windSpeed={primaryReading?.wind_speed || 8.5}
      />

      {/* Top Navbar */}
      <Navbar
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        unreadAlertsCount={summary?.active_alerts_count || 0}
        onOpenAlerts={() => setCurrentTab('alerts')}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onOpenGlobalSearch={() => setIsSearchOpen(true)}
        onNavigateToEarth3D={() => setCurrentTab('earth3d')}
        onNavigateToStreetView={handleNavigateToCurrentLocationStreetView}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <div className="flex flex-1 relative z-10">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          unreadAlertsCount={summary?.active_alerts_count || 0}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Core Platform Views */}
          {currentTab === 'dashboard' && (
            <DashboardPage
              summary={summary}
              loading={loading}
              selectedCity={selectedCity}
              cities={cities}
              onSelectCity={setSelectedCity}
              onNavigate={(tab) => {
                if (tab === 'streetview') {
                  handleNavigateToCurrentLocationStreetView();
                } else {
                  setCurrentTab(tab);
                }
              }}
              onSelectStationForForecast={handleSelectStationForForecast}
            />
          )}

          {currentTab === 'live' && (
            <CurrentAirQualityPage
              summary={summary}
              loading={loading}
              onSelectStationForForecast={handleSelectStationForForecast}
            />
          )}

          {currentTab === 'forecast' && (
            <ForecastPage cities={cities} defaultStationId={forecastStationId} />
          )}

          {currentTab === 'map' && (
            <MapPage
              cities={cities}
              selectedCity={selectedCity}
              onSelectStationForForecast={handleSelectStationForForecast}
              onNavigateToStreetView={handleNavigateToStreetView}
            />
          )}

          {currentTab === 'hotspots' && (
            <PollutionHotspotsPage
              onNavigateToMap={handleNavigateToMap}
              onSelectCity={(city) => {
                setSelectedCity(city);
                setCurrentTab('dashboard');
              }}
            />
          )}

          {currentTab === 'comparison' && (
            <CityComparisonPage
              cities={cities}
              onSelectCityForDashboard={(city) => {
                setSelectedCity(city);
                setCurrentTab('dashboard');
              }}
            />
          )}

          {currentTab === 'analytics' && (
            <EnvironmentalAnalyticsPage selectedCity={selectedCity} />
          )}

          {currentTab === 'assistant' && (
            <EcoAIPage
              selectedCity={selectedCity === 'All' ? 'National Smart Cities' : selectedCity}
              currentAqi={summary ? Math.round(summary.overall_aqi) : 135}
            />
          )}

          {currentTab === 'alerts' && <AlertsPage />}

          {currentTab === 'reports' && (
            <ReportsPage cities={cities} selectedCity={selectedCity} />
          )}

          {currentTab === 'admin' && (
            <AdminPanelPage cities={cities} />
          )}

          {/* Digital Twins, Simulations & Deep Explorer Views */}
          {currentTab === 'explorer' && (
            <CityExplorerPage
              onSelectCity={(city) => {
                setSelectedCity(city);
                setCurrentTab('dashboard');
              }}
              onNavigateToMap={handleNavigateToMap}
              onNavigateToStreetView={handleNavigateToStreetView}
            />
          )}

          {currentTab === 'travel' && (
            <TravelAirCheckPage
              cities={cities}
              onSelectCity={(city: string) => {
                setSelectedCity(city);
                setCurrentTab('dashboard');
              }}
            />
          )}

          {currentTab === 'ecoshield' && <EcoShieldPage />}

          {currentTab === 'plume' && <PlumeSimulatorPage />}

          {currentTab === 'nearby' && (
            <NearbyAirQualityPage
              onNavigateToStreetView={handleNavigateToStreetView}
              onNavigateToMap={handleNavigateToMap}
              onSelectStationForForecast={handleSelectStationForForecast}
            />
          )}

          {currentTab === 'pollutants' && (
            <PollutantAnalyticsPage
              summary={summary}
              selectedCity={selectedCity}
            />
          )}

          {currentTab === 'health' && (
            <HealthRecommendationsPage
              summary={summary}
              selectedCity={selectedCity}
            />
          )}

          {currentTab === 'scoreboard' && (
            <ScoreboardPage
              onSelectCity={(city) => {
                setSelectedCity(city);
                setCurrentTab('dashboard');
              }}
              onNavigateToMap={handleNavigateToMap}
            />
          )}

          {currentTab === 'earth3d' && (
            <Earth3DPage
              onNavigateToStreetView={handleNavigateToStreetView}
              onNavigateToMap={handleNavigateToMap}
            />
          )}

          {currentTab === 'streetview' && (
            <StreetViewPage
              initialLat={streetViewTarget.lat}
              initialLng={streetViewTarget.lng}
              initialName={streetViewTarget.name}
              autoLocate={streetViewAutoLocate}
            />
          )}

          {currentTab === 'scenario' && (
            <ScenarioStudioPage cities={cities} selectedCity={selectedCity} />
          )}

          {currentTab === 'historical' && (
            <HistoricalAnalyticsPage cities={cities} selectedCity={selectedCity} />
          )}

          {currentTab === 'upload' && <DatasetUploadPage />}

          {currentTab === 'model' && <ModelPerformancePage />}

          {currentTab === 'settings' && <SettingsPage />}

          {currentTab === 'about' && <AboutPage />}
        </main>
      </div>
    </div>
  );
};

export default App;
