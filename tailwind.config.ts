import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Tech Color Palette
        neo: {
          smoke: '#E4E7EC',
          mist: '#98A2B3',
          steel: '#667085',
          ink: '#101828',
          blue: '#2563EB',
          'blue-deep': '#1D4ED8',
          cyan: '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'SF Mono', 'monospace'],
        serif: ['var(--font-serif)', 'var(--font-serif-tc)', 'Playfair Display', 'Noto Serif TC', 'Georgia', 'serif'],
        display: ['var(--font-outfit)', 'sans-serif'],
      },
      boxShadow: {
        'neo': '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'mesh-float': 'meshFloat 12s ease-in-out infinite',
      },
      keyframes: {
        meshFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 15px) scale(0.98)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
