import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Building2, Wind, Eye, RotateCcw, Sparkles, Layers } from 'lucide-react';

interface CityDigitalTwin3DProps {
  cityName?: string;
  aqi?: number;
  category?: string;
  pm25?: number;
  pm10?: number;
  windSpeed?: number;
  temperature?: number;
  className?: string;
  height?: string | number;
}

export const CityDigitalTwin3D: React.FC<CityDigitalTwin3DProps> = ({
  cityName = 'SmartCity Central',
  aqi = 165,
  category = 'Moderate',
  pm25 = 78,
  pm10 = 135,
  windSpeed = 8.5,
  temperature = 28,
  className = '',
  height = '540px',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedZone, setSelectedZone] = useState<{ name: string; aqi: number; type: string } | null>(null);
  const [smogDomeVisible, setSmogDomeVisible] = useState<boolean>(true);
  const [trafficActive, setTrafficActive] = useState<boolean>(true);

  const stateRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    cityGroup?: THREE.Group;
    smogMesh?: THREE.Mesh;
    trafficBeams?: THREE.Points;
    animId?: number;
    isDragging: boolean;
    prevMouse: { x: number; y: number };
    rotX: number;
    rotY: number;
    zoom: number;
  }>({
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
    rotX: 0.55,
    rotY: 0.75,
    zoom: 16,
  });

  const getAqiColor = useCallback((value: number): number => {
    if (value <= 50) return 0x10b981; // Emerald
    if (value <= 100) return 0x84cc16; // Lime
    if (value <= 200) return 0xeab308; // Yellow
    if (value <= 300) return 0xf97316; // Orange
    if (value <= 400) return 0xef4444; // Red
    return 0x991b1b; // Maroon
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020817, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 14, stateRef.current.zoom);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(10, 20, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.0);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // 5. City Master Group
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // 6. Base Ground Plane with road layout grid
    const groundGeo = new THREE.PlaneGeometry(24, 24);
    const groundMat = new THREE.MeshPhongMaterial({
      color: 0x050d1a,
      emissive: 0x020817,
      shininess: 20,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    cityGroup.add(ground);

    const gridHelper = new THREE.GridHelper(24, 24, 0x0284c7, 0x1e293b);
    gridHelper.position.y = 0.02;
    cityGroup.add(gridHelper);

    // 7. Procedural 3D Skyscraper Buildings
    const gridSize = 5;
    const blockSpacing = 3.6;
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.8,
    });

    const windowGlowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
    });

    for (let r = -gridSize / 2; r <= gridSize / 2; r++) {
      for (let c = -gridSize / 2; c <= gridSize / 2; c++) {
        // Skip some spots for plazas / parks
        if ((r === 0 && c === 0) || (Math.abs(r) === 2 && Math.abs(c) === 2)) continue;

        const posX = r * blockSpacing;
        const posZ = c * blockSpacing;

        // Heights vary: taller in center, lower on periphery
        const distFromCenter = Math.sqrt(r * r + c * c);
        const height = Math.max(1.5, Math.min(8.5, (4 - distFromCenter * 0.8) * (1.8 + Math.random() * 1.5)));
        const width = 1.6 + Math.random() * 0.6;
        const depth = 1.6 + Math.random() * 0.6;

        const bGeo = new THREE.BoxGeometry(width, height, depth);
        const bMesh = new THREE.Mesh(bGeo, buildingMat);
        bMesh.position.set(posX, height / 2, posZ);
        cityGroup.add(bMesh);

        // Rooftop glowing beacon antenna
        if (height > 4.5) {
          const beaconGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
          const beaconMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
          const beacon = new THREE.Mesh(beaconGeo, beaconMat);
          beacon.position.set(posX, height + 0.6, posZ);
          cityGroup.add(beacon);

          const tipGeo = new THREE.SphereGeometry(0.12, 12, 12);
          const tipMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
          const tip = new THREE.Mesh(tipGeo, tipMat);
          tip.position.set(posX, height + 1.2, posZ);
          cityGroup.add(tip);
        }
      }
    }

    // 8. Monitoring Station Masts (4 sensor nodes)
    const stationPositions = [
      { name: 'City Center Hub', x: 0, z: 0, aqiOffset: 0 },
      { name: 'North Industrial Sector', x: 5.5, z: 5.5, aqiOffset: 35 },
      { name: 'West Commercial Boulevard', x: -5.5, z: 2, aqiOffset: -20 },
      { name: 'East Eco Green Belt', x: 5.5, z: -5.5, aqiOffset: -45 },
    ];

    stationPositions.forEach((st) => {
      const stColor = getAqiColor(Math.max(20, aqi + st.aqiOffset));
      const mastGeo = new THREE.CylinderGeometry(0.1, 0.15, 3.5, 12);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(st.x, 1.75, st.z);
      cityGroup.add(mast);

      // Glowing sensor ring
      const ringGeo = new THREE.TorusGeometry(0.5, 0.08, 12, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: stColor, transparent: true, opacity: 0.9 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(st.x, 3.5, st.z);
      ring.rotation.x = Math.PI / 2;
      cityGroup.add(ring);

      // Vertical energy scanner beam
      const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 8, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: stColor, transparent: true, opacity: 0.65 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(st.x, 7.5, st.z);
      cityGroup.add(beam);
    });

    // 9. Volumetric Smog / Particulate Dome
    const aqiColorHex = getAqiColor(aqi);
    const smogGeo = new THREE.SphereGeometry(11, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const smogMat = new THREE.MeshPhongMaterial({
      color: aqiColorHex,
      emissive: aqiColorHex,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: Math.min(0.42, Math.max(0.12, (aqi / 500) * 0.45)),
      side: THREE.DoubleSide,
      wireframe: false,
    });
    const smogMesh = new THREE.Mesh(smogGeo, smogMat);
    smogMesh.position.y = 0;
    cityGroup.add(smogMesh);

    // 10. Traffic Particulate Pulses
    const trafficCount = 350;
    const trafficPos = new Float32Array(trafficCount * 3);
    for (let i = 0; i < trafficCount; i++) {
      const idx = i * 3;
      const isHorizontal = Math.random() > 0.5;
      if (isHorizontal) {
        trafficPos[idx] = (Math.random() - 0.5) * 22;
        trafficPos[idx + 1] = 0.15;
        trafficPos[idx + 2] = (Math.floor(Math.random() * 5) - 2) * blockSpacing;
      } else {
        trafficPos[idx] = (Math.floor(Math.random() * 5) - 2) * blockSpacing;
        trafficPos[idx + 1] = 0.15;
        trafficPos[idx + 2] = (Math.random() - 0.5) * 22;
      }
    }
    const trafficGeo = new THREE.BufferGeometry();
    trafficGeo.setAttribute('position', new THREE.BufferAttribute(trafficPos, 3));
    const trafficMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.18,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const trafficBeams = new THREE.Points(trafficGeo, trafficMat);
    cityGroup.add(trafficBeams);

    stateRef.current = {
      ...stateRef.current,
      scene,
      camera,
      renderer,
      cityGroup,
      smogMesh,
      trafficBeams,
    };

    let isMounted = true;
    const animate = () => {
      if (!isMounted) return;
      stateRef.current.animId = requestAnimationFrame(animate);

      const { renderer, scene, camera, cityGroup, smogMesh, trafficBeams, isDragging, rotX, rotY } = stateRef.current;
      if (!renderer || !scene || !camera || !cityGroup) return;

      // Idle rotation when not dragging
      if (!isDragging) {
        stateRef.current.rotY += 0.002;
      }

      cityGroup.rotation.y = stateRef.current.rotY;
      cityGroup.rotation.x = stateRef.current.rotX;

      // Pulsing smog dome breathing animation
      if (smogMesh) {
        const time = Date.now() * 0.0015;
        smogMesh.scale.set(1 + Math.sin(time) * 0.02, 1 + Math.cos(time * 0.8) * 0.025, 1 + Math.sin(time) * 0.02);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !stateRef.current.renderer || !stateRef.current.camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      stateRef.current.camera.aspect = w / h;
      stateRef.current.camera.updateProjectionMatrix();
      stateRef.current.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (stateRef.current.animId) cancelAnimationFrame(stateRef.current.animId);
      renderer.dispose();
    };
  }, [aqi, getAqiColor]);

  // Mouse drag orbit controls
  const handleMouseDown = (e: React.MouseEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!stateRef.current.isDragging) return;
    const deltaX = e.clientX - stateRef.current.prevMouse.x;
    const deltaY = e.clientY - stateRef.current.prevMouse.y;

    stateRef.current.rotY += deltaX * 0.008;
    stateRef.current.rotX = Math.max(0.15, Math.min(1.1, stateRef.current.rotX + deltaY * 0.008));
    stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    stateRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const { camera } = stateRef.current;
    if (!camera) return;
    const newZ = Math.max(8, Math.min(26, camera.position.z + e.deltaY * 0.015));
    camera.position.z = newZ;
    camera.position.y = (newZ / 16) * 14;
    stateRef.current.zoom = newZ;
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none ${className}`}
      style={{ height }}
    >
      {/* 3D Canvas */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating HUD Header */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur border border-cyan-500/30 text-xs font-bold text-white shadow-xl flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>{cityName} Digital Twin</span>
          <span className="text-[10px] text-cyan-300 font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
            3D Urban Canopy
          </span>
        </div>

        <button
          onClick={() => {
            if (stateRef.current.smogMesh) {
              const visible = !stateRef.current.smogMesh.visible;
              stateRef.current.smogMesh.visible = visible;
              setSmogDomeVisible(visible);
            }
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            smogDomeVisible
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              : 'bg-slate-900/80 text-slate-400 border-slate-700'
          }`}
        >
          {smogDomeVisible ? 'Volumetric Smog Dome: ON' : 'Smog Dome: OFF'}
        </button>
      </div>

      {/* Real-time Environmental Metric Card */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-2xl shadow-2xl pointer-events-none">
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-bold uppercase">CPCB NAQI</div>
          <div className="text-2xl font-black text-white">{aqi}</div>
          <div className="text-[10px] font-bold text-cyan-400">{category}</div>
        </div>
        <div className="border-l border-slate-800 pl-3 space-y-0.5 text-xs">
          <div className="text-slate-300 font-semibold">PM2.5: <span className="text-white font-mono">{pm25} µg</span></div>
          <div className="text-slate-300 font-semibold">PM10: <span className="text-white font-mono">{pm10} µg</span></div>
          <div className="text-slate-400 text-[10px]">{windSpeed} km/h • {temperature}°C</div>
        </div>
      </div>

      {/* Legend & Controls hint */}
      <div className="absolute bottom-4 left-4 z-10 px-3.5 py-2 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 text-[11px] text-slate-400 font-medium pointer-events-none hidden sm:block">
        Drag to rotate city • Scroll to zoom • Vertical beams denote monitoring towers
      </div>
    </div>
  );
};
