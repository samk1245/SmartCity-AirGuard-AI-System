import React, { useEffect, useRef, useState } from 'react';
import { Droplets, Wind, Sparkles, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

interface FluidAtmosphericWaveProps {
  aqi?: number;
  windSpeed?: number;
  temperature?: number;
  height?: string | number;
  className?: string;
  showControls?: boolean;
  purifierActive?: boolean;
}

export const FluidAtmosphericWave: React.FC<FluidAtmosphericWaveProps> = ({
  aqi = 120,
  windSpeed = 8.5,
  temperature = 26,
  height = '380px',
  className = '',
  showControls = true,
  purifierActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [waveSpeed, setWaveSpeed] = useState<number>(1.0);
  const [waveDensity, setWaveDensity] = useState<number>(5);
  const [interactiveRipples, setInteractiveRipples] = useState<boolean>(true);

  // Effective AQI drops by 75% when purifierActive is on
  const effectiveAqi = purifierActive ? Math.max(15, Math.round(aqi * 0.22)) : aqi;

  // Determine fluid color palette
  const getPalette = (currentAqi: number) => {
    if (currentAqi <= 50) {
      return {
        primary: 'rgba(16, 185, 129, 0.7)',    // Emerald
        secondary: 'rgba(6, 182, 212, 0.55)',  // Cyan
        accent: 'rgba(56, 189, 248, 0.45)',    // Sky
        bgGlow: 'rgba(16, 185, 129, 0.12)',
        bubble: 'rgba(52, 211, 153, 0.75)',
        status: 'Pristine Clean Air Stream',
      };
    }
    if (currentAqi <= 100) {
      return {
        primary: 'rgba(20, 184, 166, 0.65)',   // Teal
        secondary: 'rgba(132, 204, 22, 0.5)',   // Lime
        accent: 'rgba(6, 182, 212, 0.4)',
        bgGlow: 'rgba(20, 184, 166, 0.12)',
        bubble: 'rgba(45, 212, 191, 0.7)',
        status: 'Satisfactory Flow',
      };
    }
    if (currentAqi <= 200) {
      return {
        primary: 'rgba(245, 158, 11, 0.65)',   // Amber
        secondary: 'rgba(6, 182, 212, 0.45)',  // Cyan
        accent: 'rgba(234, 179, 8, 0.4)',      // Yellow
        bgGlow: 'rgba(245, 158, 11, 0.14)',
        bubble: 'rgba(251, 191, 36, 0.75)',
        status: 'Moderate Haze Dispersion',
      };
    }
    if (currentAqi <= 300) {
      return {
        primary: 'rgba(249, 115, 22, 0.7)',    // Orange
        secondary: 'rgba(239, 68, 68, 0.45)',  // Red
        accent: 'rgba(217, 119, 6, 0.4)',
        bgGlow: 'rgba(249, 115, 22, 0.18)',
        bubble: 'rgba(251, 146, 60, 0.75)',
        status: 'Poor / Particulate Turbulence',
      };
    }
    return {
      primary: 'rgba(239, 68, 68, 0.75)',    // Red
      secondary: 'rgba(153, 27, 27, 0.55)',  // Maroon
      accent: 'rgba(244, 63, 94, 0.45)',     // Rose
      bgGlow: 'rgba(239, 68, 68, 0.22)',
      bubble: 'rgba(248, 113, 113, 0.8)',
      status: 'Severe Thermal Inversion Stream',
    };
  };

  const palette = getPalette(effectiveAqi);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let heightPx = (canvas.height = canvas.parentElement?.clientHeight || 380);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      heightPx = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating micro-droplets / clean-air bubble particles
    const bubbleCount = 45;
    const bubbles: {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      wobble: number;
      wobbleSpeed: number;
    }[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * heightPx,
        radius: 1.5 + Math.random() * 3.5,
        speedY: -(0.3 + Math.random() * 0.9),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: 0.2 + Math.random() * 0.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // Ripple collection from user clicks/touches
    const ripples: { x: number; y: number; radius: number; maxRadius: number; alpha: number }[] = [];

    const addRipple = (x: number, y: number) => {
      if (!interactiveRipples) return;
      ripples.push({
        x,
        y,
        radius: 5,
        maxRadius: Math.min(width, heightPx) * 0.45,
        alpha: 0.8,
      });
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      addRipple(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleCanvasMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.82) {
        const rect = canvas.getBoundingClientRect();
        addRipple(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, heightPx);

      // Deep dark fluid atmospheric background with subtle radial glow
      const radialGlow = ctx.createRadialGradient(
        width / 2,
        heightPx * 0.6,
        20,
        width / 2,
        heightPx * 0.6,
        width * 0.7
      );
      radialGlow.addColorStop(0, palette.bgGlow);
      radialGlow.addColorStop(1, 'rgba(2, 6, 23, 0.96)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, heightPx);

      step += 0.02 * waveSpeed * (0.8 + (windSpeed / 20));

      // Draw multi-layered watery sinusoidal waves
      const waveCount = waveDensity;
      const baseHeight = heightPx * 0.55;

      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        ctx.moveTo(0, heightPx);

        const waveOffset = w * (Math.PI / 3);
        const waveFrequency = 0.003 + (w * 0.001);
        const waveAmplitude = 18 + (w * 8) + (windSpeed * 1.2);

        for (let x = 0; x <= width; x += 4) {
          // Complex harmonic sine wave calculation
          const y1 = Math.sin(x * waveFrequency + step + waveOffset) * waveAmplitude;
          const y2 = Math.cos(x * 0.0015 - step * 0.7 + waveOffset * 1.5) * (waveAmplitude * 0.5);
          const y3 = Math.sin((x * 0.0008 + step * 0.4)) * 12;
          const y = baseHeight + (w * 14) + y1 + y2 + y3;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, heightPx);
        ctx.closePath();

        // Layer gradient
        const waveGrad = ctx.createLinearGradient(0, baseHeight - 40, 0, heightPx);
        if (w === 0) {
          waveGrad.addColorStop(0, palette.accent);
          waveGrad.addColorStop(1, 'rgba(2, 6, 23, 0.4)');
        } else if (w % 2 === 1) {
          waveGrad.addColorStop(0, palette.primary);
          waveGrad.addColorStop(1, 'rgba(2, 6, 23, 0.6)');
        } else {
          waveGrad.addColorStop(0, palette.secondary);
          waveGrad.addColorStop(1, 'rgba(2, 6, 23, 0.8)');
        }

        ctx.fillStyle = waveGrad;
        ctx.fill();

        // Shimmering wave crest line
        ctx.lineWidth = w === 0 ? 2 : 1.2;
        ctx.strokeStyle = w === 0 ? 'rgba(255, 255, 255, 0.65)' : palette.primary;
        ctx.stroke();
      }

      // Draw interactive watery ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.8 * waveSpeed;
        r.alpha -= 0.016;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha})`;
        ctx.stroke();

        // Secondary subtle inner echo ring
        if (r.radius > 15) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(16, 185, 129, ${r.alpha * 0.6})`;
          ctx.stroke();
        }
      }

      // Draw and animate floating bubbles/particulate motes
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y += b.speedY * waveSpeed;
        b.wobble += b.wobbleSpeed;
        b.x += b.speedX + Math.sin(b.wobble) * 0.4;

        // Reset if floating out of bounds
        if (b.y < -10) {
          b.y = heightPx + 10;
          b.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = palette.bubble;
        ctx.globalAlpha = b.opacity;
        ctx.fill();

        // Gloss highlight on bubble
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = b.opacity * 0.9;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
    };
  }, [effectiveAqi, windSpeed, temperature, waveSpeed, waveDensity, interactiveRipples, palette]);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden glass-watery-card border border-cyan-500/20 shadow-2xl select-none ${className}`}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />

      {/* Floating Watery HUD Header */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur border border-cyan-500/30 text-xs font-bold text-white shadow-xl flex items-center gap-2">
          <Droplets className="w-4 h-4 text-cyan-400 animate-bounce" />
          <span>Watery Atmospheric Fluid Wave</span>
          <span className="text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800">
            Harmonic Streamlines
          </span>
        </div>

        {purifierActive && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-xs font-bold text-emerald-300 shadow-xl flex items-center gap-1.5 animate-pulse">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Eco-Shield Active: -78% Smog</span>
          </div>
        )}
      </div>

      {/* Real-time Atmospheric Telemetry Overlay */}
      <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-2xl shadow-2xl pointer-events-none flex items-center gap-3">
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fluid State</div>
          <div className="text-base font-black text-white">{palette.status}</div>
          <div className="text-[11px] font-bold text-cyan-400">AQI: {effectiveAqi}</div>
        </div>
        <div className="border-l border-slate-800 pl-3 space-y-0.5 text-xs">
          <div className="text-slate-300 font-semibold flex items-center gap-1">
            <Wind className="w-3 h-3 text-cyan-400" /> {windSpeed} km/h
          </div>
          <div className="text-slate-400 text-[10px]">{temperature}°C Ambient</div>
        </div>
      </div>

      {/* Bottom Interactive Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800/80 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-medium">Flow Speed:</span>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.1"
                value={waveSpeed}
                onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                className="w-20 accent-cyan-400 h-1.5 rounded bg-slate-700 cursor-pointer"
              />
              <span className="text-cyan-400 font-mono text-[11px] font-bold">{waveSpeed.toFixed(1)}x</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-medium">Waves:</span>
              <input
                type="range"
                min="3"
                max="8"
                step="1"
                value={waveDensity}
                onChange={(e) => setWaveDensity(parseInt(e.target.value))}
                className="w-16 accent-teal-400 h-1.5 rounded bg-slate-700 cursor-pointer"
              />
              <span className="text-teal-400 font-mono text-[11px] font-bold">{waveDensity}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setInteractiveRipples(!interactiveRipples)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                interactiveRipples
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              {interactiveRipples ? 'Water Ripples: ON' : 'Ripples: OFF'}
            </button>

            <span className="text-[10px] text-slate-400 hidden md:inline">
              Click anywhere on water to generate fluid ripples
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
