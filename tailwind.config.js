/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          900: '#180B0B',
          800: '#2A080F',
          700: '#3B0D16',
          600: '#4D121D',
          500: '#641C26',
          400: '#7E2432',
        },
        gold: {
          100: '#FFF9E6',
          200: '#FDF0CD',
          300: '#F5D77F',
          400: '#E5C058',
          500: '#D4AF37', // Antique Gold
          600: '#B89225',
          700: '#947214',
          800: '#73560B',
        },
        saffron: {
          400: '#FFAA55',
          500: '#FF9933',
          600: '#E67300',
          700: '#CC5E00',
        },
        ivory: {
          50: '#FFFAF0',
          100: '#FFF3DC',
          200: '#F5E4C4',
          300: '#E8D2A6',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        hindi: ['"Noto Serif Devanagari"', '"Noto Sans Devanagari"', '"Noto Serif"', 'serif'],
        devanagari: ['"Noto Serif Devanagari"', '"Noto Sans Devanagari"', '"Noto Serif"', 'serif'],
        calligraphy: ['"Alex Brush"', '"Great Vibes"', 'cursive'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'royal-gradient': 'radial-gradient(ellipse at top, #641C26 0%, #3B0D16 50%, #180B0B 100%)',
        'gold-shimmer': 'linear-gradient(135deg, #FFF3DC 0%, #D4AF37 50%, #B89225 100%)',
        'gold-card': 'linear-gradient(145deg, rgba(212,175,55,0.15) 0%, rgba(59,13,22,0.85) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.35)',
        'gold-glow-lg': '0 0 50px rgba(212, 175, 55, 0.55)',
        'flame-glow': '0 0 20px rgba(255, 153, 51, 0.75), 0 0 45px rgba(212, 175, 55, 0.45)',
        'royal-card': '0 10px 30px -5px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(212, 175, 55, 0.25)',
      },
      animation: {
        'flicker': 'flicker 1.8s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'spin-slow': 'spin 40s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.95', filter: 'drop-shadow(0 0 8px #FF9933)' },
          '25%': { transform: 'scale(1.06) rotate(1deg)', opacity: '1', filter: 'drop-shadow(0 0 14px #FFD700)' },
          '50%': { transform: 'scale(0.96) rotate(-0.5deg)', opacity: '0.9', filter: 'drop-shadow(0 0 10px #FF9933)' },
          '75%': { transform: 'scale(1.04) rotate(1.5deg)', opacity: '1', filter: 'drop-shadow(0 0 16px #FFAA55)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
