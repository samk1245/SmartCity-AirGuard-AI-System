import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        unreadAlertsCount={summary?.active_alerts_count || 0}
        onOpenAlerts={() => setCurrentTab('alerts')}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onNavigateToEarth3D={() => setCurrentTab('earth3d')}
        onNavigateToStreetView={handleNavigateToCurrentLocationStreetView}
      />

      <div className="flex flex-1">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          unreadAlertsCount={summary?.active_alerts_count || 0}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
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

          {currentTab === 'live' && (
            <CurrentAirQualityPage
              summary={summary}
              loading={loading}
              onSelectStationForForecast={handleSelectStationForForecast}
            />
          )}

          {currentTab === 'historical' && (
            <HistoricalAnalyticsPage cities={cities} selectedCity={selectedCity} />
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

          {currentTab === 'alerts' && <AlertsPage />}

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
