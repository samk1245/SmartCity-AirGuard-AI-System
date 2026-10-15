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
        aqi: {
          good: "#10b981",       // 0-50
          satisfactory: "#84cc16", // 51-100
          moderate: "#f59e0b",   // 101-200
          poor: "#f97316",       // 201-300
          veryPoor: "#ef4444",   // 301-400
          severe: "#7f1d1d",     // 401-500
        }
      }
    },
  },
  plugins: [],
}
