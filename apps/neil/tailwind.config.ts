import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#000000',
          900: '#0B1120',
          800: '#0D1628',
          700: '#111f3a',
        },
        cyan: {
          accent: '#0CC1C1',
          light: '#14e8e8',
          dim: '#088a8a',
        },
        blue: {
          royal: '#2D4F8F',
        },
        orange: {
          neil: '#FF6B35',
          dim: '#cc4f1e',
          light: '#ff8c60',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'cta-gradient': 'ctaGradient 3s ease infinite',
        'cta-ring': 'ctaRing 2s ease-in-out infinite',
        'cta-pulse': 'ctaPulse 2s ease-in-out infinite',
        'orange-glow': 'orangeGlow 3s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(12,193,193,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(12,193,193,0.6)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        ctaGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        ctaRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,53,0.4)' },
          '50%': { boxShadow: '0 0 0 16px rgba(255,107,53,0)' },
        },
        ctaPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        orangeGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,53,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255,107,53,0.6)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
