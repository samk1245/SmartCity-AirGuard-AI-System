/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep forest & black-green backgrounds
        forest: {
          950: '#020906', // Primary deep black-green
          900: '#04120b', // Elevated background
          850: '#061a10', // Deep panel surface
          800: '#0a2417', // Card surface
          700: '#0f3322', // Hover surface
          600: '#164831', // Active border
        },
        // Premium Environmental Greens
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        mint: {
          300: '#a7f3d0',
          400: '#6ee7b7',
          500: '#34d399',
        },
        pista: {
          200: '#dcfce7',
          300: '#bbf7d0',
          400: '#86efac',
          500: '#4ade80',
        },
        charcoal: {
          900: '#0a0f0d',
          800: '#121815',
          700: '#1c2420',
          600: '#28332d',
        },
        // Midnight fallback compatibility
        midnight: {
          950: '#020906',
          900: '#04120b',
          800: '#061a10',
          700: '#0a2417',
          600: '#164831',
        },
        // Electric accents refined for environmental intelligence
        electric: {
          cyan: '#34d399',     // remapped to mint green for harmony
          blue: '#10b981',     // remapped to emerald
          purple: '#6ee7b7',   // remapped to soft mint
          emerald: '#00e6a0',
          orange: '#ff9f43',
          red: '#ff4560',
        },
        aqi: {
          good: "#00E6A0",         // 0-50 (Emerald)
          satisfactory: "#84CC16", // 51-100 (Lime)
          moderate: "#FF9F43",     // 101-200 (Amber)
          poor: "#F97316",         // 201-300 (Orange)
          veryPoor: "#FF4560",     // 301-400 (Rose/Red)
          severe: "#991B1B",       // 401-500 (Maroon)
        }
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.45), 0 0 10px -2px rgba(16, 185, 129, 0.3)',
        'glow-mint': '0 0 25px -4px rgba(110, 231, 183, 0.4), 0 0 10px -2px rgba(110, 231, 183, 0.25)',
        'glow-pista': '0 0 25px -4px rgba(187, 247, 208, 0.35), 0 0 10px -2px rgba(187, 247, 208, 0.2)',
        'glow-forest': '0 0 35px -5px rgba(5, 150, 105, 0.35)',
        'glow-cyan': '0 0 25px -4px rgba(52, 211, 153, 0.45), 0 0 10px -2px rgba(52, 211, 153, 0.3)',
        'glow-purple': '0 0 25px -4px rgba(110, 231, 183, 0.35)',
        'glow-orange': '0 0 25px -5px rgba(255, 159, 67, 0.4), 0 0 10px -3px rgba(255, 159, 67, 0.3)',
        'glow-red': '0 0 25px -5px rgba(255, 69, 96, 0.4), 0 0 10px -3px rgba(255, 69, 96, 0.3)',
        'spatial-glass': '0 20px 45px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(110, 231, 183, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.55), 0 0 1px 1px rgba(16, 185, 129, 0.12)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '32px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'sheen': 'sheen 1.5s cubic-bezier(0.22, 0.61, 0.36, 1) infinite',
        'scanning-beam': 'scanBeam 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
          '100%': { transform: 'translateX(250%) skewX(-20deg)' },
        },
        scanBeam: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.2' },
          '50%': { transform: 'translateY(100%)', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
