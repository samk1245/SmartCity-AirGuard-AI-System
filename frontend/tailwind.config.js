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
        midnight: {
          950: '#040911',
          900: '#07111F',
          800: '#0B1625',
          700: '#112238',
          600: '#1A3353',
        },
        electric: {
          cyan: '#00D9FF',
          blue: '#3478F6',
          purple: '#8B5CF6',
          emerald: '#00E6A0',
          orange: '#FF9F43',
          red: '#FF4560',
        },
        aqi: {
          good: "#00E6A0",         // 0-50
          satisfactory: "#84CC16", // 51-100
          moderate: "#FF9F43",     // 101-200
          poor: "#F97316",         // 201-300
          veryPoor: "#FF4560",     // 301-400
          severe: "#991B1B",       // 401-500
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 217, 255, 0.4), 0 0 10px -3px rgba(0, 217, 255, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(0, 230, 160, 0.4), 0 0 10px -3px rgba(0, 230, 160, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.4), 0 0 10px -3px rgba(139, 92, 246, 0.3)',
        'glow-orange': '0 0 25px -5px rgba(255, 159, 67, 0.4), 0 0 10px -3px rgba(255, 159, 67, 0.3)',
        'glow-red': '0 0 25px -5px rgba(255, 69, 96, 0.4), 0 0 10px -3px rgba(255, 69, 96, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
