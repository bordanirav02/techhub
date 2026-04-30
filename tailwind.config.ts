import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0f',
          surface: '#111118',
          card: '#16161f',
          border: 'rgba(255,255,255,0.07)',
          hover: '#1e1e2a',
        },
        accent: {
          blue: '#3b82f6',
          violet: '#8b5cf6',
          green: '#10b981',
          orange: '#f59e0b',
          red: '#ef4444',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee2': 'marquee2 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 1s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59,130,246,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59,130,246,0.6)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.05) 50%, transparent 75%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59,130,246,0.3)',
        'glow-violet': '0 0 20px rgba(139,92,246,0.3)',
        'glow-green': '0 0 20px rgba(16,185,129,0.3)',
        'card-hover': '0 20px 60px rgba(59,130,246,0.15)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
