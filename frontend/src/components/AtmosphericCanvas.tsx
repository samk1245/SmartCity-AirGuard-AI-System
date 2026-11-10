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
}

export const AtmosphericCanvas: React.FC<AtmosphericCanvasProps> = ({
  aqi = 120,
  particleCount = 55,
  opacity = 0.65,
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

    // Particle color palettes depending on AQI
    const getPalette = (val: number) => {
      if (val <= 50) {
        return ['#00E6A0', '#00D9FF', '#3478F6', '#10B981'];
      } else if (val <= 100) {
        return ['#00D9FF', '#84CC16', '#3478F6', '#EAB308'];
      } else if (val <= 200) {
        return ['#FF9F43', '#F59E0B', '#3478F6', '#8B5CF6'];
      } else if (val <= 300) {
        return ['#FF4560', '#FF9F43', '#8B5CF6', '#F97316'];
      } else {
        return ['#FF4560', '#991B1B', '#7C3AED', '#FF9F43'];
      }
    };

    const palette = getPalette(aqi);

    // Initialize particles
    const particles: Particle[] = [];
    const count = Math.min(particleCount, Math.floor((width * height) / 25000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.45) * 0.4,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2.5 + 1.0,
        baseAlpha: Math.random() * 0.6 + 0.2,
        color: palette[Math.floor(Math.random() * palette.length)],
        depth: Math.random() * 0.8 + 0.2,
      });
    }

    let t = 0;
    const render = () => {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient glow gradients in background
      const grad1 = ctx.createRadialGradient(
        width * 0.2 + Math.sin(t * 0.5) * 80,
        height * 0.3 + Math.cos(t * 0.5) * 60,
        10,
        width * 0.2,
        height * 0.3,
        450
      );
      grad1.addColorStop(0, aqi > 200 ? 'rgba(255, 69, 96, 0.04)' : 'rgba(0, 217, 255, 0.04)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.8 + Math.cos(t * 0.4) * 80,
        height * 0.7 + Math.sin(t * 0.4) * 60,
        10,
        width * 0.8,
        height * 0.7,
        450
      );
      grad2.addColorStop(0, aqi > 200 ? 'rgba(139, 92, 246, 0.04)' : 'rgba(0, 230, 160, 0.04)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Render particulate nodes and interconnecting wind filaments
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic drift
        p.x += p.vx + Math.sin(t + p.y * 0.005) * 0.2 * p.depth;
        p.y += p.vy + Math.cos(t + p.x * 0.005) * 0.15 * p.depth;

        // Subtle mouse displacement
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 0) {
            const force = (140 - dist) / 140;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        // Screen wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.baseAlpha * opacity;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connecting filaments between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = ((85 - dist) / 85) * 0.15 * opacity;
            ctx.lineWidth = 0.8;
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

