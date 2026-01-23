/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#06060D',
        'muted-gray': '#BAB7C2',
        'pure-white': '#FFFFFF',
        'brand-1f4c74': '#1F4C74',
        'brand-24e1c9': '#24E1C9',

        // Just Test Tailwind Colors
        primary: '#3b82f6',
        accent: '#8b5cf6',
      },
      backgroundImage: {
        // Linear gradient
        'brand-linear': 'linear-gradient(180deg, #1F4C74 50%, #24E1C9 100%)',
      },
    },
  },
  plugins: [],
}

