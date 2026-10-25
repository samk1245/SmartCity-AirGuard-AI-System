import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Wind, Flame, Eye, RotateCcw, Activity, Layers, Info } from 'lucide-react';

interface PlumeDispersion3DProps {
  className?: string;
  height?: string | number;
}

export type StabilityClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export const PlumeDispersion3D: React.FC<PlumeDispersion3DProps> = ({
  className = '',
  height = '520px',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Model parameters
  const [emissionRate, setEmissionRate] = useState<number>(120); // Q in g/s
  const [stackHeight, setStackHeight] = useState<number>(45); // H in meters
  const [windSpeed, setWindSpeed] = useState<number>(5.5); // u in m/s
  const [stability, setStability] = useState<StabilityClass>('D'); // Pasquill class
  const [calculatedCmax, setCalculatedCmax] = useState<number>(0);
  const [calculatedXmax, setCalculatedXmax] = useState<number>(0);

  const stateRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    particlesMesh?: THREE.Points;
    particlePositions?: Float32Array;
    particleColors?: Float32Array;
    particleBirths?: Float32Array;
    particleSpeeds?: Float32Array;
    chimneyMesh?: THREE.Mesh;
    animId?: number;
    isDragging: boolean;
    prevMouse: { x: number; y: number };
    rotX: number;
    rotY: number;
    zoom: number;
    emissionRate: number;
    stackHeight: number;
    windSpeed: number;
    stability: StabilityClass;
  }>({
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
    rotX: 0.35,
    rotY: 0.85,
    zoom: 24,
    emissionRate,
    stackHeight,
    windSpeed,
    stability,
  });

  // Keep stateRef synced with React state
  useEffect(() => {
    stateRef.current.emissionRate = emissionRate;
    stateRef.current.stackHeight = stackHeight;
    stateRef.current.windSpeed = windSpeed;
    stateRef.current.stability = stability;

    // Calculate analytical Gaussian peak concentration & distance
    // x_max ≈ (H / sqrt(2 * c))^...
    const H = stackHeight;
    const u = Math.max(1, windSpeed);
    const Q = emissionRate;

    // Empirical Pasquill coefficients for class D / neutral
    const coeffMap: Record<StabilityClass, { a: number; b: number; c: number; d: number }> = {
      A: { a: 0.22, b: 0.90, c: 0.20, d: 1.0 },
      B: { a: 0.16, b: 0.90, c: 0.12, d: 1.0 },
      C: { a: 0.11, b: 0.90, c: 0.08, d: 0.92 },
      D: { a: 0.08, b: 0.90, c: 0.06, d: 0.88 },
      E: { a: 0.06, b: 0.90, c: 0.03, d: 0.82 },
      F: { a: 0.04, b: 0.90, c: 0.016, d: 0.78 },
    };
    const { c: sigC, d: sigD } = coeffMap[stability];
    const xMaxEst = Math.pow(H / (Math.sqrt(2) * sigC), 1 / sigD);
    const sigY = 0.08 * Math.pow(Math.max(10, xMaxEst), 0.9);
    const sigZ = sigC * Math.pow(Math.max(10, xMaxEst), sigD);
    const cMax = (Q / (Math.PI * u * sigY * sigZ)) * Math.exp(-0.5 * Math.pow(H / sigZ, 2)) * 1000;

    setCalculatedCmax(Math.round(cMax));
    setCalculatedXmax(Math.round(xMaxEst * 10)); // Scaled to meters
  }, [emissionRate, stackHeight, windSpeed, stability]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020817, 0.025);
    stateRef.current.scene = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 12, stateRef.current.zoom);
    camera.lookAt(0, 0, 0);
    stateRef.current.camera = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);
    stateRef.current.renderer = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight.position.set(15, 25, 10);
    scene.add(dirLight);

    // 5. Ground Plane & Grid
    const groundGeo = new THREE.PlaneGeometry(36, 18);
    const groundMat = new THREE.MeshPhongMaterial({
      color: 0x050d1a,
      emissive: 0x020817,
      shininess: 15,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(6, 0, 0);
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(36, 36, 0x0284c7, 0x1e293b);
    gridHelper.position.set(6, 0.02, 0);
    scene.add(gridHelper);

    // 6. Industrial Stack (Chimney)
    const chimneyGroup = new THREE.Group();
    scene.add(chimneyGroup);

    const baseGeo = new THREE.CylinderGeometry(0.5, 0.7, 1.0, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(-8, 0.5, 0);
    chimneyGroup.add(baseMesh);

    // Main column
    const stackH = stackHeight / 10;
    const colGeo = new THREE.CylinderGeometry(0.25, 0.4, stackH, 16);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 });
    const colMesh = new THREE.Mesh(colGeo, colMat);
    colMesh.position.set(-8, 1.0 + stackH / 2, 0);
    chimneyGroup.add(colMesh);
    stateRef.current.chimneyMesh = colMesh;

    // Hazard ring bands (red & white)
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: r % 2 === 0 ? 0xef4444 : 0xffffff });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(-8, 1.0 + stackH * (0.6 + r * 0.12), 0);
      chimneyGroup.add(ring);
    }

    // 7. Plume Particles (2,500 particles)
    const particleCount = 2500;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const births = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = -8;
      positions[i * 3 + 1] = 1.0 + stackH;
      positions[i * 3 + 2] = 0;
      births[i] = Math.random() * 8.0;
      speeds[i] = 0.8 + Math.random() * 0.4;

      // Color starts intense fiery orange/magenta, fades to cyan/grey downwind
      colors[i * 3 + 0] = 0.95;
      colors[i * 3 + 1] = 0.4;
      colors[i * 3 + 2] = 0.1;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    stateRef.current.particlesMesh = particles;
    stateRef.current.particlePositions = positions;
    stateRef.current.particleColors = colors;
    stateRef.current.particleBirths = births;
    stateRef.current.particleSpeeds = speeds;

    // 8. Wind Direction Indicator Arrow
    const arrowDir = new THREE.Vector3(1, 0, 0);
    const arrowOrigin = new THREE.Vector3(-10, 0.5, -4);
    const arrowHelper = new THREE.ArrowHelper(arrowDir, arrowOrigin, 3.5, 0x06b6d4, 0.6, 0.4);
    scene.add(arrowHelper);

    // 9. Downwind Distance Markers along ground (X axis)
    const distances = [
      { x: -4, label: '500m' },
      { x: 0, label: '1000m' },
      { x: 5, label: '2000m' },
      { x: 10, label: '3000m' },
      { x: 15, label: '4000m' },
    ];
    distances.forEach((d) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(d.x, 0.03, -2),
        new THREE.Vector3(d.x, 0.03, 2),
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.5 });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
    });

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      stateRef.current.animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Camera position from spherical coordinates
      const camRadius = stateRef.current.zoom;
      const phi = stateRef.current.rotX;
      const theta = stateRef.current.rotY;

      camera.position.x = camRadius * Math.sin(theta) * Math.cos(phi);
      camera.position.y = Math.max(3, camRadius * Math.sin(phi));
      camera.position.z = camRadius * Math.cos(theta) * Math.cos(phi);
      camera.lookAt(2, 2.5, 0);

      // Animate particles following Gaussian Plume physics
      const pos = stateRef.current.particlePositions;
      const col = stateRef.current.particleColors;
      const bths = stateRef.current.particleBirths;
      const spds = stateRef.current.particleSpeeds;
      const u = stateRef.current.windSpeed * 0.4;
      const currentH = stateRef.current.stackHeight / 10;
      const stab = stateRef.current.stability;

      // Dispersion spread factors based on stability
      const stabSpread: Record<StabilityClass, { lat: number; vert: number }> = {
        A: { lat: 0.45, vert: 0.40 },
        B: { lat: 0.35, vert: 0.30 },
        C: { lat: 0.28, vert: 0.22 },
        D: { lat: 0.20, vert: 0.15 },
        E: { lat: 0.14, vert: 0.09 },
        F: { lat: 0.09, vert: 0.05 },
      };
      const { lat: sigYSpread, vert: sigZSpread } = stabSpread[stab];

      if (pos && col && bths && spds) {
        for (let i = 0; i < particleCount; i++) {
          bths[i] += delta * spds[i];

          // Downwind distance X
          const x = -8 + bths[i] * u * 3.5;
          const downwindDist = Math.max(0.1, x - (-8));

          // Gaussian lateral diffusion
          const sigY = sigYSpread * Math.pow(downwindDist, 0.85);
          const sigZ = sigZSpread * Math.pow(downwindDist, 0.8);

          // Lateral position Y (orthogonal to wind)
          const seedY = Math.sin(i * 137.5 + time * 0.5);
          const seedZ = Math.cos(i * 193.3 + time * 0.5);

          const ySpread = seedY * sigY * (0.8 + Math.sin(time + i) * 0.3);
          // Vertical position: stack height + thermal plume rise - ground reflection
          const thermalRise = Math.min(2.5, Math.pow(downwindDist, 0.4) * 0.8);
          const zSpread = 1.0 + currentH + thermalRise + seedZ * sigZ * (0.8 + Math.cos(time + i) * 0.3);

          // Ground reflection barrier
          const actualZ = Math.max(0.15, zSpread);

          pos[i * 3 + 0] = x;
          pos[i * 3 + 1] = actualZ;
          pos[i * 3 + 2] = ySpread;

          // Color fade from hot magenta to dispersed cyan
          const progress = Math.min(1.0, downwindDist / 26.0);
          col[i * 3 + 0] = THREE.MathUtils.lerp(0.98, 0.02, progress);
          col[i * 3 + 1] = THREE.MathUtils.lerp(0.35, 0.72, progress);
          col[i * 3 + 2] = THREE.MathUtils.lerp(0.15, 0.95, progress);

          // Recycle particle once past boundary
          if (x > 22 || actualZ > 14) {
            bths[i] = 0;
            pos[i * 3 + 0] = -8;
            pos[i * 3 + 1] = 1.0 + currentH;
            pos[i * 3 + 2] = 0;
          }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 11. Mouse Drag & Orbit Controls
    const handleMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const dx = e.clientX - stateRef.current.prevMouse.x;
      const dy = e.clientY - stateRef.current.prevMouse.y;
      stateRef.current.prevMouse = { x: e.clientX, y: e.clientY };

      stateRef.current.rotY += dx * 0.008;
      stateRef.current.rotX = Math.max(0.08, Math.min(1.3, stateRef.current.rotX + dy * 0.008));
    };

    const handleMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      stateRef.current.zoom = Math.max(12, Math.min(42, stateRef.current.zoom + e.deltaY * 0.02));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      if (stateRef.current.animId) cancelAnimationFrame(stateRef.current.animId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      renderer.dispose();
    };
  }, []);

  const handleResetCamera = () => {
    stateRef.current.rotX = 0.35;
    stateRef.current.rotY = 0.85;
    stateRef.current.zoom = 24;
  };

  return (
    <div className={`relative flex flex-col rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing relative"
      />

      {/* Floating 3D HUD Header */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg pointer-events-auto">
          <Wind className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide">
            Gaussian Plume Atmospheric Dispersion Model
          </span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            3D WebGL
          </span>
        </div>
      </div>

      {/* Floating Calculation Telemetry HUD */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 backdrop-blur-md shadow-xl pointer-events-auto space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Peak Ground Level (Cmax):</span>
            <span className="font-mono font-bold text-rose-400">{calculatedCmax} µg/m³</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Peak Impact Distance (Xmax):</span>
            <span className="font-mono font-bold text-amber-400">{calculatedXmax} m</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Pasquill Stability:</span>
            <span className="font-bold text-cyan-400">Class {stability}</span>
          </div>
        </div>

        <button
          onClick={handleResetCamera}
          className="self-end p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition pointer-events-auto shadow-md"
          title="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Dispersion Controls Toolbar */}
      <div className="z-20 p-4 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Emission Rate Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Emission Rate (Q)
            </span>
            <span className="font-mono font-bold text-white">{emissionRate} g/s</span>
          </div>
          <input
            type="range"
            min={10}
            max={500}
            step={5}
            value={emissionRate}
            onChange={(e) => setEmissionRate(Number(e.target.value))}
            className="w-full accent-amber-400 h-1.5 bg-slate-950 rounded cursor-pointer"
          />
        </div>

        {/* Stack Height Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Stack Height (H)
            </span>
            <span className="font-mono font-bold text-white">{stackHeight} m</span>
          </div>
          <input
            type="range"
            min={15}
            max={120}
            step={5}
            value={stackHeight}
            onChange={(e) => setStackHeight(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded cursor-pointer"
          />
        </div>

        {/* Wind Speed Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-emerald-400" /> Wind Velocity (u)
            </span>
            <span className="font-mono font-bold text-white">{windSpeed} m/s</span>
          </div>
          <input
            type="range"
            min={1.0}
            max={20.0}
            step={0.5}
            value={windSpeed}
            onChange={(e) => setWindSpeed(Number(e.target.value))}
            className="w-full accent-emerald-400 h-1.5 bg-slate-950 rounded cursor-pointer"
          />
        </div>

        {/* Pasquill Stability Class Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" /> Stability Class
            </span>
            <span className="font-bold text-purple-400">Class {stability}</span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {(['A', 'B', 'C', 'D', 'E', 'F'] as StabilityClass[]).map((cls) => (
              <button
                key={cls}
                onClick={() => setStability(cls)}
                className={`py-1 rounded font-bold transition text-center ${
                  stability === cls
                    ? 'bg-purple-500 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title={`Class ${cls}`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
