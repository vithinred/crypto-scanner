import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bebas)', 'cursive'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
        sans:    ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        bg:      '#03050a',
        surface: 'rgba(255,255,255,0.032)',
        border:  'rgba(255,255,255,0.065)',
        neon:    '#00ffa3',
        cyan:    '#00c6ff',
        pink:    '#ff3e7f',
        gold:    '#ffd166',
        muted:   '#4a5268',
        text:    '#dde2ee',
      },
      backgroundImage: {
        'gradient-neon':    'linear-gradient(135deg, #00ffa3, #00c6ff)',
        'gradient-card':    'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        'gradient-surface': 'radial-gradient(circle at 30% 30%, rgba(0,255,163,0.04), transparent 60%)',
      },
      animation: {
        'ticker':    'ticker 40s linear infinite',
        'pulse-neon':'pulse-neon 2s ease-in-out infinite',
        'float':     'float 4s ease-in-out infinite',
        'shimmer':   'shimmer 1.5s infinite',
        'fade-up':   'fade-up 0.6s ease both',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'pulse-neon': {
          '0%,100%': { boxShadow: '0 0 5px #00ffa3' },
          '50%':     { boxShadow: '0 0 20px #00ffa3, 0 0 40px #00ffa3' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to:   { backgroundPosition: '-200% 0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'neon':    '0 0 20px rgba(0,255,163,0.3)',
        'neon-lg': '0 0 40px rgba(0,255,163,0.2), 0 0 80px rgba(0,255,163,0.1)',
        'card':    '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,163,0.15)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
