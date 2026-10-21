import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Wind, Gauge, Sparkles, Eye, RotateCw } from 'lucide-react';

interface AtmosphericFlowfield3DProps {
  aqi?: number;
  windSpeed?: number;
  windDirection?: number;
  temperature?: number;
  className?: string;
  height?: string | number;
}

export const AtmosphericFlowfield3D: React.FC<AtmosphericFlowfield3DProps> = ({
  aqi = 145,
  windSpeed = 8.5,
  windDirection = 210,
  temperature = 26,
  className = '',
  height = '380px',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'streamlines' | 'aerosols' | 'vectors'>('streamlines');
  const [particleDensity, setParticleDensity] = useState<'low' | 'medium' | 'dense'>('medium');
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const stateRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    particles?: THREE.Points;
    flowLines?: THREE.LineSegments;
    positions?: Float32Array;
    velocities?: Float32Array;
    colors?: Float32Array;
    animId?: number;
    rotationAngle: number;
    isDragging: boolean;
    prevMouse: { x: number; y: number };
    rotX: number;
    rotY: number;
  }>({
    rotationAngle: 0,
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
    rotX: 0.2,
    rotY: 0.5,
  });

  const getAqiColorVector = useCallback((value: number): THREE.Color => {
    if (value <= 50) return new THREE.Color(0x10b981); // Emerald
    if (value <= 100) return new THREE.Color(0x84cc16); // Lime
    if (value <= 200) return new THREE.Color(0xeab308); // Yellow
    if (value <= 300) return new THREE.Color(0xf97316); // Orange
    if (value <= 400) return new THREE.Color(0xef4444); // Red
    return new THREE.Color(0x991b1b); // Maroon
  }, []);

  const particleCount = particleDensity === 'low' ? 1200 : particleDensity === 'medium' ? 2400 : 4000;

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const heightPx = container.clientHeight || 380;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020817, 0.08);

    const camera = new THREE.PerspectiveCamera(50, width / heightPx, 0.1, 100);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // 3. Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 2, 20);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // 4. Ground Grid / Spatial Radar plane
    const gridHelper = new THREE.GridHelper(12, 16, 0x0284c7, 0x1e293b);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // 5. Build Flow Particles
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor = getAqiColorVector(aqi);
    const radWind = (windDirection * Math.PI) / 180;
    const speedFactor = Math.max(0.015, (windSpeed / 30) * 0.06);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Position within a 3D atmospheric volume bounding box
      positions[idx] = (Math.random() - 0.5) * 12;
      positions[idx + 1] = Math.random() * 5 - 1.8;
      positions[idx + 2] = (Math.random() - 0.5) * 12;

      // Velocity oriented with wind angle and turbulence
      const spread = (Math.random() - 0.5) * 0.4;
      velocities[idx] = -Math.sin(radWind + spread) * speedFactor * (0.8 + Math.random() * 0.4);
      velocities[idx + 1] = (Math.random() - 0.5) * 0.008; // subtle vertical convection
      velocities[idx + 2] = -Math.cos(radWind + spread) * speedFactor * (0.8 + Math.random() * 0.4);

      // Color variation based on AQI and height
      const c = baseColor.clone();
      if (Math.random() > 0.6) {
        c.offsetHSL((Math.random() - 0.5) * 0.08, 0, (Math.random() - 0.5) * 0.15);
      }
      colors[idx] = c.r;
      colors[idx + 1] = c.g;
      colors[idx + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: viewMode === 'aerosols' ? 0.14 : 0.08,
      vertexColors: true,
      transparent: true,
      opacity: viewMode === 'aerosols' ? 0.75 : 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    stateRef.current = {
      ...stateRef.current,
      scene,
      camera,
      renderer,
      particles,
      positions,
      velocities,
      colors,
    };

    let isMounted = true;
    const animate = () => {
      if (!isMounted) return;
      stateRef.current.animId = requestAnimationFrame(animate);

      const { renderer, scene, camera, particles, positions, velocities, isDragging, rotX, rotY } = stateRef.current;
      if (!renderer || !scene || !camera || !particles || !positions || !velocities) return;

      // Update particle positions
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        positions[idx] += velocities[idx];
        positions[idx + 1] += velocities[idx + 1];
        positions[idx + 2] += velocities[idx + 2];

        // Wrap around boundaries
        if (positions[idx] > 6) positions[idx] = -6;
        if (positions[idx] < -6) positions[idx] = 6;
        if (positions[idx + 1] > 3.5) positions[idx + 1] = -1.8;
        if (positions[idx + 1] < -1.8) positions[idx + 1] = 3.5;
        if (positions[idx + 2] > 6) positions[idx + 2] = -6;
        if (positions[idx + 2] < -6) positions[idx + 2] = 6;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Slow idle orbital sweep
      if (!isDragging && isRotating) {
        stateRef.current.rotY += 0.003;
      }

      scene.rotation.y = stateRef.current.rotY;
      scene.rotation.x = stateRef.current.rotX;

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
      geometry.dispose();
      material.dispose();
    };
  }, [aqi, windSpeed, windDirection, temperature, particleDensity, viewMode, isRotating, getAqiColorVector]);

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
    stateRef.current.rotX = Math.max(-0.4, Math.min(0.7, stateRef.current.rotX + deltaY * 0.008));
    stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    stateRef.current.isDragging = false;
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
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating HUD Header */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur border border-cyan-500/30 text-xs font-bold text-white shadow-xl flex items-center gap-2">
          <Wind className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>3D Particulate Flowfield</span>
          <span className="text-[10px] text-cyan-300 font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
            {particleCount} Particulates
          </span>
        </div>

        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isRotating
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900/80 text-slate-400 border-slate-700'
          }`}
        >
          {isRotating ? 'Orbit: Active' : 'Orbit: Paused'}
        </button>
      </div>

      {/* Live Atmospheric Parameters Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3 bg-slate-900/90 backdrop-blur border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs text-slate-300 shadow-xl pointer-events-none hidden sm:flex">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-semibold text-white">{windSpeed} km/h</span>
          <span className="text-slate-400 text-[10px]">Speed</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
          <span className="font-semibold text-white">{windDirection}°</span>
          <span className="text-slate-400 text-[10px]">Vector</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
          <span className="font-semibold text-white">{temperature}°C</span>
          <span className="text-slate-400 text-[10px]">Thermal</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('streamlines')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'streamlines'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Streamlines
          </button>
          <button
            onClick={() => setViewMode('aerosols')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'aerosols'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aerosol Cloud
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 px-2 font-medium">Density:</span>
          {(['low', 'medium', 'dense'] as const).map((density) => (
            <button
              key={density}
              onClick={() => setParticleDensity(density)}
              className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
                particleDensity === density
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {density}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
