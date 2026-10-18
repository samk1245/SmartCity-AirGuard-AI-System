import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GlobePoint } from '../types';

interface ThreeDGlobeProps {
  points: GlobePoint[];
  selectedCityName?: string;
  onSelectPoint?: (point: GlobePoint) => void;
  className?: string;
  height?: number | string;
}

// Convert Lat/Lng to 3D Cartesian coordinates on a sphere of radius R
const toCartesian = (lat: number, lng: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// CPCB AQI color helper
const getAqiColor = (aqi: number): number => {
  if (aqi <= 50) return 0x10b981; // Emerald
  if (aqi <= 100) return 0x84cc16; // Lime
  if (aqi <= 200) return 0xeab308; // Yellow
  if (aqi <= 300) return 0xf97316; // Orange
  if (aqi <= 400) return 0xef4444; // Red
  return 0x991b1b; // Maroon
};

export const ThreeDGlobe: React.FC<ThreeDGlobeProps> = ({
  points,
  selectedCityName,
  onSelectPoint,
  className = '',
  height = '500px',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<GlobePoint | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  // References to keep track of mutable Three.js objects
  const stateRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    globeGroup?: THREE.Group;
    markersGroup?: THREE.Group;
    raycaster?: THREE.Raycaster;
    mouse?: THREE.Vector2;
    animFrameId?: number;
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    targetRotation: { x: number; y: number };
    currentRotation: { x: number; y: number };
    zoom: number;
    markerMeshes: Array<{ mesh: THREE.Mesh; point: GlobePoint }>;
  }>({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    targetRotation: { x: 0.3, y: 1.2 },
    currentRotation: { x: 0.3, y: 1.2 },
    zoom: 2.8,
    markerMeshes: [],
  });

  const setupScene = useCallback(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.12);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.z = stateRef.current.zoom;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(5, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.2);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    // 5. Starfield background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 50;
      starPositions[i + 1] = (Math.random() - 0.5) * 50;
      starPositions[i + 2] = (Math.random() - 0.5) * 50;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // 6. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 6a. Main Dark Earth Sphere
    const sphereRadius = 1.0;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x050d1a,
      emissive: 0x020817,
      shininess: 30,
      specular: 0x0284c7,
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earthMesh);

    // 6b. Subtle Atmosphere Glow Shell
    const glowGeo = new THREE.SphereGeometry(sphereRadius * 1.025, 48, 48);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // 6c. Latitude and Longitude Grids
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.45,
    });

    // Latitude rings
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * (Math.PI / 180);
      const ringRadius = sphereRadius * Math.sin(phi);
      const ringY = sphereRadius * Math.cos(phi);
      const ringCurve = new THREE.EllipseCurve(0, 0, ringRadius, ringRadius, 0, 2 * Math.PI, false, 0);
      const ringPoints = ringCurve.getPoints(64).map((p) => new THREE.Vector3(p.x, ringY, p.y));
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ring = new THREE.Line(ringGeo, gridMat);
      globeGroup.add(ring);
    }

    // Longitude circles
    for (let lng = 0; lng < 180; lng += 30) {
      const longPoints: THREE.Vector3[] = [];
      const radLng = lng * (Math.PI / 180);
      for (let angle = 0; angle <= 360; angle += 6) {
        const rad = angle * (Math.PI / 180);
        const y = sphereRadius * Math.cos(rad);
        const horizontalRadius = sphereRadius * Math.sin(rad);
        const x = horizontalRadius * Math.cos(radLng);
        const z = horizontalRadius * Math.sin(radLng);
        longPoints.push(new THREE.Vector3(x, y, z));
      }
      const longGeo = new THREE.BufferGeometry().setFromPoints(longPoints);
      const longLine = new THREE.Line(longGeo, gridMat);
      globeGroup.add(longLine);
    }

    // 7. Markers Group
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);

    // 8. Raycaster & Mouse
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Store in stateRef
    stateRef.current = {
      ...stateRef.current,
      scene,
      camera,
      renderer,
      globeGroup,
      markersGroup,
      raycaster,
      mouse,
    };
  }, []);

  // Update Markers when points change
  useEffect(() => {
    const { markersGroup } = stateRef.current;
    if (!markersGroup) return;

    // Clear old markers
    while (markersGroup.children.length > 0) {
      const obj = markersGroup.children[0];
      markersGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
    stateRef.current.markerMeshes = [];

    // Add marker meshes
    points.forEach((point) => {
      const pos = toCartesian(point.latitude, point.longitude, 1.02);
      const colorHex = getAqiColor(point.aqi);

      // Marker sphere
      const markerGeo = new THREE.SphereGeometry(0.026, 16, 16);
      const markerMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);
      markerMesh.userData = { point };

      // Halo ring around high pollution points
      if (point.aqi > 150) {
        const ringGeo = new THREE.RingGeometry(0.035, 0.048, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(new THREE.Vector3(0, 0, 0));
        markersGroup.add(ring);
      }

      // Vertical energy beam
      const beamHeight = Math.min(0.25, Math.max(0.06, (point.aqi / 500) * 0.25));
      const beamGeo = new THREE.CylinderGeometry(0.003, 0.003, beamHeight, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.75,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      
      // Orient beam outward from Earth center
      const normal = pos.clone().normalize();
      beam.position.copy(pos.clone().add(normal.clone().multiplyScalar(beamHeight / 2)));
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      markersGroup.add(markerMesh);
      markersGroup.add(beam);

      stateRef.current.markerMeshes.push({ mesh: markerMesh, point });
    });
  }, [points]);

  // Rotate towards selected city if changed
  useEffect(() => {
    if (!selectedCityName) return;
    const pt = points.find((p) => p.name.toLowerCase() === selectedCityName.toLowerCase());
    if (pt) {
      // Calculate rotation angles to point camera at this city
      const targetPhi = (pt.latitude * Math.PI) / 180;
      const targetTheta = -(pt.longitude * Math.PI) / 180 - Math.PI / 2;
      stateRef.current.targetRotation.x = targetPhi * 0.7;
      stateRef.current.targetRotation.y = targetTheta;
    }
  }, [selectedCityName, points]);

  // Main Render Loop
  useEffect(() => {
    setupScene();

    let isMounted = true;
    const animate = () => {
      if (!isMounted) return;
      stateRef.current.animFrameId = requestAnimationFrame(animate);

      const {
        renderer,
        scene,
        camera,
        globeGroup,
        isDragging,
        targetRotation,
        currentRotation,
      } = stateRef.current;

      if (!renderer || !scene || !camera || !globeGroup) return;

      // Auto rotation when idle
      if (!isDragging && isAutoRotating) {
        targetRotation.y += 0.0025;
      }

      // Smooth damping / interpolation towards target rotation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

      globeGroup.rotation.x = currentRotation.x;
      globeGroup.rotation.y = currentRotation.y;

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
      if (stateRef.current.animFrameId) {
        cancelAnimationFrame(stateRef.current.animFrameId);
      }
      if (stateRef.current.renderer) {
        stateRef.current.renderer.dispose();
      }
    };
  }, [setupScene, isAutoRotating]);

  // Mouse / Touch Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = mountRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    // Handle drag rotation
    if (stateRef.current.isDragging) {
      const deltaX = e.clientX - stateRef.current.previousMousePosition.x;
      const deltaY = e.clientY - stateRef.current.previousMousePosition.y;

      stateRef.current.targetRotation.y += deltaX * 0.006;
      stateRef.current.targetRotation.x = Math.max(
        -Math.PI / 2.5,
        Math.min(Math.PI / 2.5, stateRef.current.targetRotation.x + deltaY * 0.006)
      );

      stateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
      return;
    }

    // Raycasting for marker hover
    const { camera, raycaster, mouse, markerMeshes } = stateRef.current;
    if (!camera || !raycaster || !mouse) return;

    mouse.x = (mouseX / rect.width) * 2 - 1;
    mouse.y = -(mouseY / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const meshes = markerMeshes.map((m) => m.mesh);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const pt = hit.userData?.point as GlobePoint | undefined;
      setHoveredPoint(pt || null);
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseUp = () => {
    stateRef.current.isDragging = false;
  };

  const handleClick = () => {
    if (hoveredPoint && onSelectPoint) {
      onSelectPoint(hoveredPoint);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const { camera } = stateRef.current;
    if (!camera) return;
    const newZ = Math.max(1.6, Math.min(4.5, camera.position.z + e.deltaY * 0.002));
    camera.position.z = newZ;
    stateRef.current.zoom = newZ;
  };

  return (
    <div
      className={`relative select-none overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 ${className}`}
      style={{ height }}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />

      {/* Floating HUD Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Interactive 3D Earth</span>
          <span className="text-[10px] text-cyan-300 font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
            WebGL 60FPS
          </span>
        </div>

        <button
          onClick={() => setIsAutoRotating((prev) => !prev)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors shadow-lg ${
            isAutoRotating
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          {isAutoRotating ? 'Auto-Orbit: ON' : 'Auto-Orbit: PAUSED'}
        </button>
      </div>

      {/* AQI Color Legend */}
      <div className="absolute bottom-4 left-4 z-10 p-3 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-2xl text-[11px] space-y-1.5 hidden sm:block pointer-events-none">
        <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-800">
          CPCB NAQI Index
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Good (0–50)</span>
        </div>
        <div className="flex items-center gap-2 text-lime-400 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-lime-500" />
          <span>Satisfactory (51–100)</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-400 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span>Moderate (101–200)</span>
        </div>
        <div className="flex items-center gap-2 text-orange-400 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span>Poor (201–300)</span>
        </div>
        <div className="flex items-center gap-2 text-rose-400 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Very Poor (301–400)</span>
        </div>
        <div className="flex items-center gap-2 text-red-500 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-red-700" />
          <span>Severe (&gt;400)</span>
        </div>
      </div>

      {/* Interactive Tooltip on Marker Hover */}
      {hoveredPoint && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: mousePos.x, top: mousePos.y - 12 }}
        >
          <div className="p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 shadow-2xl shadow-cyan-950/80 text-white min-w-44 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
              <span className="font-bold text-sm text-cyan-300">{hoveredPoint.name}</span>
              <span className="text-[10px] text-slate-400 font-semibold">{hoveredPoint.country}</span>
            </div>
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-slate-400">CPCB AQI:</span>
              <span className="font-extrabold text-sm text-white">{hoveredPoint.aqi}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">Category:</span>
              <span
                className="font-bold px-1.5 py-0.5 rounded text-[10px]"
                style={{
                  backgroundColor: `${hoveredPoint.category === 'Good' ? '#065f46' : hoveredPoint.category === 'Satisfactory' ? '#3f6212' : hoveredPoint.category === 'Moderate' ? '#854d0e' : hoveredPoint.category === 'Poor' ? '#9a3412' : '#991b1b'}80`,
                  color: hoveredPoint.category === 'Good' ? '#34d399' : hoveredPoint.category === 'Satisfactory' ? '#a3e635' : hoveredPoint.category === 'Moderate' ? '#fde047' : hoveredPoint.category === 'Poor' ? '#fb923c' : '#f87171',
                }}
              >
                {hoveredPoint.category}
              </span>
            </div>
            <div className="mt-2 text-[10px] text-cyan-400/80 italic text-center">
              Click marker to inspect location & street view
            </div>
          </div>
        </div>
      )}

      {/* Navigation hint */}
      <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur border border-slate-800 text-[11px] text-slate-400 font-medium hidden md:block pointer-events-none">
        Drag to rotate | Scroll to zoom | Click marker to inspect
      </div>
    </div>
  );
};
