/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          'light': '#fca5a5', // red-300
          'DEFAULT': '#f87171', // red-400
          'dark': '#ef4444', // red-500
        },
        'secondary': '#fb923c', // orange-400
        'accent': '#34d399',   // emerald-400
        
        'light-bg': '#f8fafc',       // slate-50
        'light-surface': '#ffffff',
        'light-border': '#e2e8f0',   // slate-200
        'light-text-primary': '#0f172a', // slate-900
        'light-text-secondary': '#475569', // slate-600

        'dark-bg': '#0B1120',
        'dark-surface': '#171F2E',
        'dark-border': '#334155', 
        'dark-text-primary': '#f1f5f9',    // slate-100
        'dark-text-secondary': '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: '0% 50%',
          },
          to: {
            backgroundPosition: '100% 50%',
          },
        },
      },
      animation: {
        aurora: 'aurora 15s ease infinite',
      },
    },
  },
  plugins: [],
} 