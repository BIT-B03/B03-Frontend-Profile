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
        'brand-getstarted': 'linear-gradient(90deg, #22979F 0%, #205D7E 80%)',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn-flash': {
          position: 'relative',
          overflow: 'hidden',
          zIndex: '0',
        },
        '.btn-flash::after': {
          content: "''",
          position: 'absolute',
          left: '-30%',
          top: '120%',
          width: '160%',
          height: '60%',
          pointerEvents: 'none',
          zIndex: '0',
          background: 'linear-gradient(180deg, rgba(34,151,159,0.95) 0%, rgba(34,151,159,0.6) 40%, rgba(34,151,159,0) 100%)',
          transform: 'rotate(-20deg) translateY(0)',
          opacity: '0',
          transition: 'transform 450ms cubic-bezier(.2,.9,.2,1), opacity 300ms ease',
        },
        '.btn-flash:hover::after, .btn-flash:focus::after': {
          transform: 'rotate(-20deg) translateY(-220%)',
          opacity: '1',
        },
      })
    }
  ],
}

