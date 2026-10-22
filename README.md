# SmartCity AirGuard AI 2.0 🌬️🏛️🛰️
### Immersive 3D Environmental Intelligence, National Geographic Directory & Predictive Pollution Analytics Platform

[![CI Pipeline](https://github.com/samk1245/SmartCity-AirGuard-AI-System/actions/workflows/ci.yml/badge.svg)](https://github.com/samk1245/SmartCity-AirGuard-AI-System/actions/workflows/ci.yml)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%208-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js%20WebGL-black?logo=threedotjs&logoColor=white)](https://threejs.org)
[![Scikit-Learn](https://img.shields.io/badge/Machine%20Learning-Scikit--Learn-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![CPCB NAQI](https://img.shields.io/badge/Standard-CPCB%20NAQI%20India-blue)](https://cpcb.nic.in)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 1. Executive Overview

**SmartCity AirGuard AI 2.0** is an enterprise-grade environmental intelligence, GIS mapping, and predictive machine learning platform engineered to address severe urban air quality crises across India. Combining real-time **Central Pollution Control Board (CPCB)** Continuous Ambient Air Quality Monitoring Systems (CAAQMS), **Open-Meteo Global Atmospheric Reanalysis**, and **Nominatim GPS Geolocation**, AirGuard AI delivers cinematic 3D digital twins alongside defensible public health advisories.

The platform provides comprehensive coverage across **all 28 Indian States and 8 Union Territories (36 administrative regions)**, tracking hundreds of municipal centers, continuous monitoring towers, and spatial particulate dispersion patterns.

---

## 2. Core Platform Capabilities

### 🌐 1. Interactive 3D Earth & Urban Digital Twin
- **Global 3D Earth**: Rotatable, zoomable WebGL globe displaying global atmospheric reference points and continental smog transport corridors.
- **Urban Digital Twin (City Mode)**: Procedural 3D city scene featuring extruded architectural skyscrapers, traffic light beams, air quality monitoring beacons, and an animated volumetric breathing smog dome that dynamically shifts colors based on ambient AQI.
- **Atmospheric Particle Flowfield**: Multi-threaded Canvas2D/WebGL simulation visualizing wind vector trajectories and particulate dispersal.

### 🧭 2. Real-Time 360° Street View & Live GPS Teleportation
- Direct integration with Google Maps public street-level panoramic frames and OpenStreetMap viewports.
- **One-Click Live Current Location Street View**: Browser Geolocation API detects user latitude/longitude, queries reverse-geocoding via Nominatim to identify exact street names, and renders immediate street-level atmospheric conditions.
- Real-time pedestrian mask alerts, CPCB category badges, and telemetry overlays embedded beside the street view viewport.

### 🗺️ 3. National India City & State Geographic Explorer
- Searchable directory covering **all 36 States & Union Territories**.
- Real-time filtering by continuous CAAQMS monitoring station availability vs. satellite-modeled data.
- Search across cities, districts, and state capitals with instant navigation to 2D GIS maps, Street View, and analytical dashboards.

### 🧪 4. Chemical Speciation & Pollutant Analytics Deep Dive
- Detailed tracking of all statutory pollutants: **$PM_{2.5}, PM_{10}, NO_2, SO_2, CO, O_3,$ and $NH_3$**.
- Compliance gauges showing current concentration vs. CPCB 24-Hour Permissible Ceilings & WHO Global Guidelines.
- Multi-pollutant radar footprint and chemical origin profiles (vehicular combustion, thermal power, biomass, industrial VOCs).

### 🩺 5. Evidence-Based Health Guidance & Outdoor Activity Planner
- Activity safety feasibility ratings: **Outdoor Running/Jogging, Cycling, Walking/Hiking, School Sports & Recess, Outdoor Yoga (Pranayama)**.
- Targeted vulnerable demographic matrices: **Infants & Children, Elderly Citizens (65+), Asthmatics & COPD Patients, Pregnant Women, Outdoor Gig Workers**.
- Mask recommendations (N95 / N99 / FFP2) and indoor air purifier ventilation protocols.
- Interactive AQI slider simulator across 0–500 breakpoints with statutory clinical disclaimers.

### 📡 6. Proximity Radar & Nearby Station Distance Matrix
- Automated Great-Circle Haversine calculations detecting closest monitoring towers relative to user GPS coordinates.
- Radial scan radius selector (25 km, 50 km, 100 km, 250 km) with station distance sorting and pollutant comparisons.

### 🏆 7. National India Pollution Scoreboard
- Real-time municipal scoreboard ranking highest pollution hotspots vs. cleanest urban havens.
- Station density counts and verified CAAQMS monitoring badges.
- **One-Click Export to CSV** for educational, municipal, and journalistic analysis.

### 🔮 8. Chronological ML Forecasting Engine
- Trains scikit-learn non-linear regressors (`HistGradientBoostingRegressor`, `RandomForestRegressor`) on chronological historical data.
- Autoregressive feature engineering with multi-hour lags ($1h, 6h, 12h, 24h$), rolling windows, and cyclical time encodings.
- Delivers $+1h$ to $+72h$ forecasts with **10th–90th quantile prediction uncertainty intervals**.

### 🎛️ 9. "What-If" Policy Simulation Studio
- Dynamic policy sliders simulating urban interventions:
  - *Odd-Even Vehicular Rationing*
  - *Industrial Emission Abatement Caps*
  - *Construction Smog Guns & Water Sprinklers*
  - *EV Transit Adoption Incentives*
  - *Green Buffer Afforestation Belts*
- Computes projected AQI reduction, respiratory ER visit drops, and public health impact scores.

### 🔊 10. Cybernetic Web Audio Soundscape
- Synthesizer generating responsive ambient tones and feedback chimes using the HTML5 Web Audio API, with user toggle control.

---

## 3. System Architecture

```mermaid
flowchart TD
    subgraph Data Sources & GIS Providers
        CPCB[CPCB CAAQMS Network - 44 Stations]
        OpenMeteo[Open-Meteo Air Quality & Weather API]
        Nominatim[OSM / Nominatim Reverse Geocoding]
        CSV[Datasets & Custom CSV Ingestion]
    end

    subgraph Backend - FastAPI (Python 3.11-3.13)
        API[FastAPI REST API /api]
        CPCB_Calc[CPCB NAQI Breakpoint Engine]
        India_Dir[India Geographic Directory - 36 States/UTs]
        Health_Eng[Health & Activity Recommendation Engine]
        Radar_Eng[Haversine Proximity Radar Engine]
        Scoreboard[National Scoreboard Engine]
        ML_Pipeline[Lag Features & HistGradientBoosting Model]
        Alert_Sys[Alerts & Cooldown Engine]
    end

    subgraph Frontend - React 19 + TypeScript + Vite 8
        ThreeD[Three.js 3D Earth Globe & Digital Twin City]
        StreetView[Street View 360° Explorer & Geolocation]
        Explorer_UI[City & State 36-Region Explorer]
        Pollutants_UI[Pollutant Deep Dive & Radar Footprint]
        Health_UI[Health & Outdoor Activity Planner]
        Radar_UI[Nearby Station Proximity Radar]
        Scoreboard_UI[National Pollution Scoreboard]
        Map_UI[Leaflet Geospatial 2D GIS Map]
        Scenario_UI['What-If' Urban Policy Studio]
        Analytics_UI[Historical Recharts Analytics]
        Audio_Sys[Web Audio API Cybernetic Soundscape]
    end

    CPCB --> API
    OpenMeteo --> API
    Nominatim --> API
    CSV --> API

    API <--> CPCB_Calc
    API <--> India_Dir
    API <--> Health_Eng
    API <--> Radar_Eng
    API <--> Scoreboard
    API <--> ML_Pipeline
    API <--> Alert_Sys

    API <--> ThreeD
    API <--> StreetView
    API <--> Explorer_UI
    API <--> Pollutants_UI
    API <--> Health_UI
    API <--> Radar_UI
    API <--> Scoreboard_UI
    API <--> Map_UI
    API <--> Scenario_UI
    API <--> Analytics_UI
```

---

## 4. CPCB NAQI Standards Reference

AirGuard AI calculates composite air quality using the statutory Indian National Air Quality Index (NAQI) formula:

$$I_p = \frac{I_{high} - I_{low}}{C_{high} - C_{low}} \times (C_p - C_{low}) + I_{low}$$

Overall AQI is determined by the dominant pollutant sub-index: $\text{AQI} = \max(I_{PM2.5}, I_{PM10}, I_{NO2}, I_{SO2}, I_{CO}, I_{O3}, I_{NH3})$.

| AQI Band | Category | Theme Color | Health Descriptor |
| :---: | :---: | :---: | :--- |
| **0 – 50** | **Good** | `#10B981` (Emerald) | Minimal health impact. Clean ambient air. |
| **51 – 100** | **Satisfactory** | `#84CC16` (Lime) | Minor breathing discomfort to sensitive people. |
| **101 – 200** | **Moderate** | `#F59E0B` (Amber) | Breathing discomfort to the people with lung, asthma and heart diseases. |
| **201 – 300** | **Poor** | `#F97316` (Orange) | Breathing discomfort to most people on prolonged exposure. |
| **301 – 400** | **Very Poor** | `#EF4444` (Crimson) | Respiratory illness on prolonged exposure. |
| **401 – 500** | **Severe** | `#7F1D1D` (Maroon) | Severe respiratory distress; impacts healthy individuals. |

---

## 5. REST API Reference

The backend provides over 20 structured endpoints accessible under `/api` with interactive Swagger docs at [`http://localhost:8000/docs`](http://localhost:8000/docs):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check, active stations count, and ML model status |
| `GET` | `/api/locations` | All seeded municipal cities and continuous monitoring stations |
| `GET` | `/api/locations/states` | All 36 Indian states and Union Territories with summary statistics |
| `GET` | `/api/locations/states/{state}/cities` | Cities in a given state with station availability flag |
| `GET` | `/api/locations/india/search` | Fast search across all Indian cities and districts |
| `GET` | `/api/air-quality/current` | Latest observed multi-pollutant readings and composite CPCB AQI |
| `GET` | `/api/air-quality/summary` | Historical time-series analytics (daily, weekly, monthly aggregation) |
| `GET` | `/api/air-quality/nearby` | Proximity radar calculating stations within radial distance |
| `GET` | `/api/air-quality/compare` | Multi-city side-by-side air quality comparison |
| `GET` | `/api/scoreboard` | National pollution scoreboard (highest pollution vs cleanest) |
| `GET` | `/api/health-recommendations` | Evidence-based health guidance and outdoor activity planner |
| `POST` | `/api/predictions/forecast` | Multi-step ML pollution forecasts with uncertainty intervals |
| `GET` | `/api/map/stations` | Geospatial GeoJSON coordinate list for GIS mapping |
| `GET` | `/api/live-location/air-quality` | Real-time atmospheric conditions from Open-Meteo for any GPS coords |
| `GET` | `/api/live-location/reverse` | Reverse geocoding GPS coordinates to road, neighbourhood, and city |
| `GET` | `/api/globe/points` | 3D spherical Cartesian coordinates for interactive Earth |
| `GET` | `/api/streetview/metadata` | Street View panoramic embed metadata for given coordinates |
| `POST` | `/api/models/train` | Retrains scikit-learn machine learning model on latest datasets |
| `GET` | `/api/models/metrics` | Model evaluation metrics (MAE, RMSE, $R^2$, MAPE, Baseline) |
| `GET` | `/api/alerts` | Active atmospheric threshold violation alerts and notifications |

---

## 6. Quickstart Guide

### Prerequisites
- **Python 3.11+**
- **Node.js 20+**
- **Git**

### Clone the Repository
```bash
git clone https://github.com/samk1245/SmartCity-AirGuard-AI-System.git
cd SmartCity-AirGuard-AI-System
```

### Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
python -m app.db.seed
python -m app.ml.train

# Start backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend runs at `http://localhost:8000` (Docs at `http://localhost:8000/docs`).*

### Frontend Setup (React 19 + Vite 8)
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 7. Running with Docker Compose

To deploy both backend and frontend in isolated production containers:

```bash
docker-compose up --build -d
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 8. Automated Test Suite

Run the 31-test automated backend verification suite covering CPCB calculations, endpoint routing, Haversine proximity calculations, and health recommendations:

```bash
cd backend
pytest -v
```

Expected output:
```
============================= 31 passed in 20.72s =============================
```

Run the frontend TypeScript verification and production build:

```bash
cd frontend
npm run build
```

---

## 9. Repository Structure

```
SmartCity-AirGuard-AI-System/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI matrix (Py 3.11, 3.12, 3.13, Node 20)
├── backend/
│   ├── app/
│   │   ├── api/                 # REST endpoints & routing
│   │   ├── core/                # App configuration & CORS settings
│   │   ├── db/                  # SQLAlchemy SQLite database & seeds
│   │   ├── ml/                  # Feature engineering, training & inference
│   │   ├── models/              # Database ORM models
│   │   ├── schemas/             # Pydantic validation schemas
│   │   ├── services/            # CPCB NAQI, India locations, health planner, radar
│   │   └── tests/               # 31 unit & integration tests
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/          # 3D Globe, City Digital Twin, Gauges, Sidebar, Navbar
│   │   ├── pages/               # 13 Dashboard pages
│   │   ├── services/            # Typed REST API client
│   │   ├── types/               # TypeScript interfaces
│   │   └── utils/               # Audio synthesizers, color scalers
│   ├── package.json
│   └── Dockerfile
├── datasets/                    # Benchmark training datasets
├── docker-compose.yml
├── LICENSE                      # MIT License
└── README.md
```

---

## 10. License & Attribution

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

- Air quality standards derived from the **Central Pollution Control Board (CPCB)**, Ministry of Environment, Forest and Climate Change, Government of India.
- Real-time atmospheric observations and forecasts powered by **Open-Meteo API**.
- Geolocation and geographic coordinates attributed to **OpenStreetMap** contributors via **Nominatim**.
