import React, { useRef, useState, useCallback } from 'react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
  tiltStrength?: number;
  depth?: number;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  tiltStrength = 15,
  depth = 30,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const glowStyles = {
    cyan: 'hover:shadow-[0_15px_35px_rgba(6,182,212,0.25)] hover:border-cyan-500/50',
    emerald: 'hover:shadow-[0_15px_35px_rgba(16,185,129,0.25)] hover:border-emerald-500/50',
    amber: 'hover:shadow-[0_15px_35px_rgba(245,158,11,0.25)] hover:border-amber-500/50',
    rose: 'hover:shadow-[0_15px_35px_rgba(244,63,94,0.25)] hover:border-rose-500/50',
    purple: 'hover:shadow-[0_15px_35px_rgba(168,85,247,0.25)] hover:border-purple-500/50',
  }[glowColor];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation (-tiltStrength to +tiltStrength)
      const rotX = ((y - centerY) / centerY) * -tiltStrength;
      const rotY = ((x - centerX) / centerX) * tiltStrength;

      setRotateX(rotX);
      setRotateY(rotY);

      // Glare reflection percentage
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePos({ x: glareX, y: glareY, opacity: 0.18 });
    },
    [tiltStrength]
  );

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 relative transition-transform duration-200 ease-out ${className}`}
    >
      <div
        className={`relative w-full h-full rounded-2xl border transition-all duration-300 preserve-3d overflow-hidden ${glowStyles}`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Glassmorphic Glare Sheen */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-30"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
          }}
        />

        {/* Inner Content with 3D Depth displacement */}
        <div
          className="w-full h-full"
          style={{
            transform: `translateZ(${depth}px)`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
