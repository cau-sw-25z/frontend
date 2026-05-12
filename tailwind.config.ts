import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#111827',
        background: '#0F172A',
        success: '#22C55E',
        danger: '#EF4444',
      },

      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
    },
  },
};

export default config;