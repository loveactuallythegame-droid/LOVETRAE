/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary gradient colors
        'primary-gradient-start': '#db147c',  // Pink
        'primary-gradient-end': '#f05d68',    // Orange-red
        
        // Profile/avatar ring gradient
        'profile-ring-start': '#fcc738',      // Yellow
        'profile-ring-mid': '#ea031f',        // Red
        'profile-ring-end': '#c60ab3',        // Purple
        
        // Inner circle/line gradient
        'inner-line-start': '#ef1b6e',        // Pink
        'inner-line-mid1': '#c41e77',         // Purple-pink
        'inner-line-mid2': '#a22ac4',         // Purple
        'inner-line-end': '#9056ef',          // Blue-purple
        
        // Accent colors
        'accent-pink': '#FC0C84',
        'accent-orange': '#ff7600',
        'accent-yellow': '#ffef1f',
        'accent-teal': '#37cf97',
        'accent-violet': '#b37dec',
        'accent-rose': '#e16ba9',
        
        // UI colors
        'background': '#0f0a0c',
        'surface': '#1a0a1f',
        'dark-surface': '#1a0a1f',
        'card': 'rgba(26, 10, 31, 0.8)',
        'text-primary': '#ffffff',
        'text-secondary': 'rgba(255, 255, 255, 0.6)',
        'text-hint': 'rgba(255, 255, 255, 0.4)',
        'border': 'rgba(255, 255, 255, 0.1)',
        'focus-outline': '#fc0c84',
        
        // Status colors
        'success': '#33DEA5',
        'warning': '#E11637',
        'error': '#E11637',
        'info': '#22d3ee',
        
        // Game category colors
        'emotional-connection': '#FA1F63',
        'conflict-resolution': '#33DEA5',
        'creative-chaos': '#E4E831',
        'romance-hub': '#BE1980',
        'healing-hospital': '#5C1459',
        'game-show': '#22d3ee',
        'love-arcade': '#FF6B6B',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      fontSize: {
        'mobile-header': '1.5rem',
        'mobile-body': '1rem',
      },
      minHeight: {
        'screen-dynamic': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      screens: {
        'sm-mobile': {'raw': '(max-height: 667px)'},  // iPhone SE
        'md-mobile': {'raw': '(min-height: 668px) and (max-height: 896px)'},  // iPhone 8 to iPhone 11 Pro Max
        'lg-mobile': {'raw': '(min-height: 897px)'},  // iPhone 12 Pro Max and larger
      },
    },
  },
  plugins: [],
}