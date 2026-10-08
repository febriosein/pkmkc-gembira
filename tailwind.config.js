/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        gempink: '#FF6B8B',
        gemyellow: '#FFD166',
        gemblue: '#118AB2',
        gemgreen: '#06D6A0',
        gempurple: '#8338EC',
        gemdark: '#2B2D42',
        gemorange: '#FB8500',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'bounce-short': 'bounce-short 0.5s ease-in-out 2',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 107, 139, 0.6)' },
          '50%': { boxShadow: '0 0 30px rgba(6, 214, 160, 0.8)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'bounce-short': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
