import React, { useEffect, useRef } from 'react';

interface AtmosphericCanvasProps {
  aqi?: number;
  particleCount?: number;
  opacity?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  color: string;
  depth: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface DustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export const AtmosphericCanvas: React.FC<AtmosphericCanvasProps> = ({
  aqi = 120,
  particleCount = 60,
  opacity = 0.75,
  className = 'fixed inset-0 pointer-events-none z-0',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for gentle wind breeze interaction
    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Environmental Palette based on AQI:
    // Good/Satisfactory: Deep Forest, Emerald, Mint, Pista
    // Moderate/Poor: Emerald with warm amber hints
    // Severe: Deep Emerald with muted crimson warning accents
    const getPalette = (val: number) => {
      if (val <= 50) {
        return ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#059669'];
      } else if (val <= 100) {
        return ['#34D399', '#86EFAC', '#10B981', '#A3E635', '#047857'];
      } else if (val <= 200) {
        return ['#10B981', '#F59E0B', '#34D399', '#6EE7B7', '#D97706'];
      } else if (val <= 300) {
        return ['#34D399', '#F97316', '#10B981', '#FB923C', '#065F46'];
      } else {
        return ['#10B981', '#EF4444', '#047857', '#F87171', '#064E3B'];
      }
    };

    const palette = getPalette(aqi);

    // Initialize atmospheric particles
    const particles: Particle[] = [];
    const count = Math.min(particleCount, Math.floor((width * height) / 22000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.48) * 0.35,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.2 + 1.0,
        baseAlpha: Math.random() * 0.5 + 0.25,
        color: palette[Math.floor(Math.random() * palette.length)],
        depth: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Initialize subtle floating dust motes for environmental depth
    const dustMotes: DustMote[] = [];
    for (let i = 0; i < 28; i++) {
      dustMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.15 - Math.random() * 0.2,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    let t = 0;
    const render = () => {
      t += 0.007;
      ctx.clearRect(0, 0, width, height);

      // 1. Dynamic Forest & Emerald Ambient Lighting (slowly breathing radial fog)
      const grad1 = ctx.createRadialGradient(
        width * 0.25 + Math.sin(t * 0.4) * 100,
        height * 0.25 + Math.cos(t * 0.35) * 70,
        15,
        width * 0.25,
        height * 0.25,
        width * 0.45
      );
      grad1.addColorStop(0, 'rgba(16, 185, 129, 0.055)');
      grad1.addColorStop(0.5, 'rgba(5, 150, 105, 0.025)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.75 + Math.cos(t * 0.3) * 90,
        height * 0.65 + Math.sin(t * 0.4) * 80,
        20,
        width * 0.75,
        height * 0.65,
        width * 0.5
      );
      grad2.addColorStop(0, 'rgba(110, 231, 183, 0.045)');
      grad2.addColorStop(0.5, 'rgba(4, 120, 87, 0.02)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Animated Light Rays / Volumetric Luminance Stream
      ctx.save();
      const rayAngle = Math.PI * 0.35 + Math.sin(t * 0.2) * 0.04;
      const rayGrad = ctx.createLinearGradient(0, 0, width * 0.8, height);
      rayGrad.addColorStop(0, 'rgba(167, 243, 208, 0.025)');
      rayGrad.addColorStop(0.4, 'rgba(52, 211, 153, 0.018)');
      rayGrad.addColorStop(0.8, 'transparent');
      ctx.fillStyle = rayGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 3. Interactive Cursor Spatial Ambient Focus
      if (mouse.active) {
        const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        cursorGlow.addColorStop(0, 'rgba(52, 211, 153, 0.085)');
        cursorGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.035)');
        cursorGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = cursorGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 4. Undulating Atmospheric Boundary Layer Fog (Ground Inversion Layer)
      const fogHeight = height * 0.22;
      const fogGrad = ctx.createLinearGradient(0, height - fogHeight, 0, height);
      fogGrad.addColorStop(0, 'transparent');
      fogGrad.addColorStop(0.5, 'rgba(4, 24, 16, 0.22)');
      fogGrad.addColorStop(1, 'rgba(2, 9, 6, 0.6)');
      ctx.fillStyle = fogGrad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 40) {
        const yOffset = Math.sin(x * 0.003 + t * 0.6) * 16 + Math.cos(x * 0.006 - t * 0.4) * 10;
        ctx.lineTo(x, height - fogHeight * 0.65 + yOffset);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // 5. Render Subtle Dust Motes (Background Depth)
      for (let i = 0; i < dustMotes.length; i++) {
        const d = dustMotes[i];
        d.x += d.vx + Math.sin(t + i) * 0.1;
        d.y += d.vy;
        if (d.y < -10) d.y = height + 10;
        if (d.x < -10) d.x = width + 10;
        if (d.x > width + 10) d.x = -10;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#6EE7B7';
        ctx.globalAlpha = d.alpha * opacity * 0.6;
        ctx.fill();
      }

      // 4. Render Atmospheric Particles & Interconnecting Filaments
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth aerodynamic drift
        p.x += p.vx + Math.sin(t * 0.8 + p.y * 0.004) * 0.22 * p.depth;
        p.y += p.vy + Math.cos(t * 0.8 + p.x * 0.004) * 0.18 * p.depth;

        // Subtle mouse displacement
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150;
            p.x += (dx / dist) * force * 1.6;
            p.y += (dy / dist) * force * 1.6;
          }
        }

        // Screen wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Pulsing luminance
        const currentAlpha = p.baseAlpha * (0.8 + 0.2 * Math.sin(t * p.pulseSpeed * 60 + p.pulsePhase));

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha * opacity;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connecting filaments between proximate nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = ((90 - dist) / 90) * 0.16 * opacity;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [aqi, particleCount, opacity]);

  return <canvas ref={canvasRef} className={className} />;
};

export default AtmosphericCanvas;
