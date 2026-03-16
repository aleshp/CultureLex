/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          900: '#070E1A',
          800: '#0D1B2A',
          700: '#132336',
          600: '#1A2F48',
          500: '#22395A',
          400: '#2A4570',
        },
        gold: {
          300: '#FFE085',
          400: '#FFD04A',
          500: '#FFC233',
          600: '#FFAD00',
        },
        sky: {
          400: '#60C4FF',
          500: '#4DB8FF',
          600: '#2AA5FF',
        },
        coral: {
          400: '#FF8166',
          500: '#FF6B4A',
          600: '#FF5530',
        },
        jade: {
          400: '#4AE08A',
          500: '#2ECC71',
          600: '#27AE60',
        },
      },
      fontFamily: {
        display: ['"Exo 2"', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      animation: {
        'flip-in': 'flipIn 0.4s ease-out',
        'flip-out': 'flipOut 0.4s ease-in',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'shake': 'shake 0.4s ease-in-out',
        'pop': 'pop 0.3s cubic-bezier(0.68,-0.55,0.265,1.55)',
      },
      keyframes: {
        flipIn: {
          '0%': { transform: 'rotateY(-90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 194, 51, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255, 194, 51, 0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'steppe-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFC233' fill-opacity='0.04'%3E%3Cpath d='M20 0L40 20L20 40L0 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
