/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'romance-pink': '#FA1F63',
        'royal-purple': '#5C1459',
        'violet': '#BE1980',
        'mint-green': '#33DEA5',
        'warning-yellow': '#E4E831',
        'dark-bg': '#120016',
        'dark-surface': '#1a0a1f',
      },
      backgroundImage: {
        'radial-royal': 'radial-gradient(ellipse at center, #5C1459 0%, #120016 100%)',
      },
      fontFamily: {
        body: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Dancing Script', 'cursive'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        glow: {
          '0%': { textShadow: '0 0 6px rgba(250, 31, 99, 0.35)' },
          '100%': { textShadow: '0 0 12px rgba(250, 31, 99, 0.6)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'marcie-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-8px)' },
          '50%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 2s infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 600ms ease-out both',
        'fade-in': 'fade-in 600ms ease-out both',
        'marcie-bounce': 'marcie-bounce 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
