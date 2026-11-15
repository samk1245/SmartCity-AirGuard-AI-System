import React, { useRef, useState, useCallback } from 'react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple' | 'mint' | 'pista';
  tiltStrength?: number;
  depth?: number;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  children,
  className = '',
  glowColor = 'emerald',
  tiltStrength = 12,
  depth = 24,
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
    emerald: 'hover:shadow-[0_22px_50px_rgba(16,185,129,0.35)] hover:border-emerald-400/60 border-emerald-500/20',
    mint: 'hover:shadow-[0_22px_50px_rgba(110,231,183,0.35)] hover:border-mint-400/60 border-mint-500/20',
    pista: 'hover:shadow-[0_22px_50px_rgba(187,247,208,0.3)] hover:border-pista-300/60 border-pista-400/20',
    cyan: 'hover:shadow-[0_22px_50px_rgba(52,211,153,0.35)] hover:border-emerald-400/60 border-emerald-500/20',
    amber: 'hover:shadow-[0_22px_50px_rgba(245,158,11,0.35)] hover:border-amber-400/60 border-amber-500/20',
    rose: 'hover:shadow-[0_22px_50px_rgba(244,63,94,0.35)] hover:border-rose-400/60 border-rose-500/20',
    purple: 'hover:shadow-[0_22px_50px_rgba(110,231,183,0.35)] hover:border-mint-400/60 border-mint-500/20',
  }[glowColor] || 'hover:shadow-[0_22px_50px_rgba(16,185,129,0.35)] hover:border-emerald-400/60 border-emerald-500/20';

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Smooth subtle tilt
      const rotX = ((y - centerY) / centerY) * -tiltStrength;
      const rotY = ((x - centerX) / centerX) * tiltStrength;

      setRotateX(rotX);
      setRotateY(rotY);

      // Apple Vision Pro style specular reflection position
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePos({ x: glareX, y: glareY, opacity: 0.22 });
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
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(187,247,208,0.32) 0%, rgba(52,211,153,0.12) 40%, transparent 70%)`,
          }}
        />

        {/* Spatial 3D Depth displacement */}
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
