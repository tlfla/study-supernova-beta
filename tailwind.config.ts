import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          300: '#6ED7CC',
          400: '#3BC6B8',
          500: '#11B5A4',
          600: '#0FA396',
          700: '#0D8E83',
        },
        secondary: {
          500: '#7B9EFF',
        },
        bookmark: {
          active: '#FFB436',
          hover: '#E2A52F',
        },
        status: {
          success: '#2DC98A',
          warning: '#FFC85C',
          danger: '#FF6B6B',
          info: '#38BDF8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
