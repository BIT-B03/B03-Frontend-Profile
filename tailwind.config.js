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

        // Dashboard statistik accents (reusable)
        'stat-blue': '#3B82F6',
        'stat-red': '#EF4444',
        'stat-yellow': '#F59E0B',

        // Profile Member
        'brand-fill': 'rgba(4,4,9, 0.50)',
        'brand-stroke': '#4A4A4A',

        // Filter Button Colors
        'filter-all-bg': 'rgba(183,183,183,0.45)',
        'filter-all-border': '#979797',
        'filter-red-bg': 'rgba(222,0,0,0.45)',
        'filter-red-border': '#980000',
        'filter-sage-bg': 'rgba(34,165,167,0.45)',
        'filter-sage-border': '#22A5A7',

        // Members badge (blue)
        'badge-members-bg': 'rgba(36,126,255,0.45)',
        'badge-members-border': '#1E90FF',
      },
      backgroundImage: {
        // Linear gradient
        'brand-linear': 'linear-gradient(180deg, #1F4C74 50%, #24E1C9 100%)',
        'brand-getstarted': 'linear-gradient(90deg, #22979F 0%, #205D7E 80%)',

        // Background
        'brand-overlay': 'linear-gradient(180deg, rgba(24,107,181,0.04), rgba(0,0,0,0) 60%)',
        'brand-vignette': `
          radial-gradient(
            ellipse 90% 50% at center,
            #0B243A 0%,
            #0A2034 10%,
            #091C2E 20%,
            #081828 30%,
            #071421 40%,
            #06101B 50%,
            #050C15 60%,
            #04080F 70%,
            #030509 80%,
            #020204 90%,
            #000000 100%
          )
        `,
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
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

        // Glassmorphism container
        '.glass': {
          backgroundColor: theme('colors.brand-fill'),
          borderColor: theme('colors.brand-stroke'),
          borderWidth: '1px',
          backdropFilter: 'blur(20px)',
        },
        '.glass-sm': {
          backgroundColor: theme('colors.brand-fill'),
          borderColor: theme('colors.brand-stroke'),
          borderWidth: '1px',
          backdropFilter: 'blur(8px)',
        },
        '.glass-lg': {
          backgroundColor: theme('colors.brand-fill'),
          borderColor: theme('colors.brand-stroke'),
          borderWidth: '1px',
          backdropFilter: 'blur(28px)',
        },

        // Glassmorphism white (highlighted)
        '.glass-white': {
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderColor: 'rgba(255,255,255,0.25)',
          borderWidth: '1px',
          backdropFilter: 'blur(20px)',
        },
      })
    }
  ],
}

