/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
        crimson: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        temple: {
          50: '#ecfdf5',
          100: '#d1fae5',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        cream: {
          50: '#ffffff',
          100: '#fffdfa',
          200: '#fef8ee',
          300: '#fdf2e9',
          400: '#fbe4d0',
        },
        cat: {
          academic: '#2563eb', // Royal Blue
          personal: '#9333ea', // Mystic Purple
          health: '#059669',   // Emerald Green
          career: '#ea580c',   // Saffron Orange
          other: '#64748b',    // Slate Gray
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        festive: ['Rozha One', 'serif'],
        handwritten: ['Kalam', 'cursive'],
      },
      animation: {
        'diya-flicker': 'diyaFlicker 2s infinite ease-in-out',
        'float': 'float 3s infinite ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'shimmer': 'shimmer 2.5s infinite linear',
        'marigold-sway': 'marigoldSway 4s infinite ease-in-out',
      },
      keyframes: {
        diyaFlicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.95', filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.8))' },
          '50%': { transform: 'scale(1.08) rotate(1deg)', opacity: '1', filter: 'drop-shadow(0 0 15px rgba(234, 179, 8, 1))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(234, 179, 8, 0.8)' },
        },
        marigoldSway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        }
      }
    },
  },
  plugins: [],
};
