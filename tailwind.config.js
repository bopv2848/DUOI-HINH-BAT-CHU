/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        primary: ['"Nunito"', 'sans-serif'],
        fun: ['"Baloo 2"', 'cursive'],
        cyber: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Primary school playful palette
        primarySchool: {
          bg: '#FFFDF5',
          card: '#FFFFFF',
          accent: '#FF6B6B',
          yellow: '#FFD166',
          green: '#06D6A0',
          blue: '#118AB2',
          purple: '#8338EC',
        },
        // Secondary school adventure palette
        secondarySchool: {
          bg: '#0F172A',
          card: '#1E293B',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          electric: '#3B82F6',
        },
        // High school E-sports & sleek palette
        highSchool: {
          bg: '#090D16',
          card: '#131A29',
          gold: '#F59E0B',
          slate: '#334155',
          indigo: '#6366F1',
          crimson: '#EF4444',
        }
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.6))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.2))' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'shake': 'shake 0.4s ease-in-out',
        'pop-in': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    },
  },
  plugins: [],
}
