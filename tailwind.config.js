/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Custom gradient colors
        'glass': {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.08)',
          200: 'rgba(255, 255, 255, 0.12)',
          300: 'rgba(255, 255, 255, 0.16)',
          400: 'rgba(255, 255, 255, 0.20)',
          500: 'rgba(255, 255, 255, 0.25)',
        },

      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'liquid': 'liquidMove 28s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2.2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',

        'glass-shimmer': 'glassShimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        liquidMove: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -2%, 0) scale(1.05)' },
          '100%': { transform: 'translate3d(-2%, 2%, 0) scale(1.02)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(56, 189, 248, 0.0), 0 0 0 0 rgba(147, 51, 234, 0.0)' },
          '50%': { boxShadow: '0 0 24px 4px rgba(56, 189, 248, 0.12), 0 0 36px 6px rgba(147, 51, 234, 0.10)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.3), 0 0 40px rgba(56, 189, 248, 0.1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.5), 0 0 60px rgba(56, 189, 248, 0.2)' 
          },
        },
        gradientShift: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%' 
          },
          '50%': { 
            backgroundPosition: '100% 50%' 
          },
        },

        glassShimmer: {
          '0%': { 
            backgroundPosition: '-200% 0' 
          },
          '100%': { 
            backgroundPosition: '200% 0' 
          },
        },
      },
      boxShadow: {
        'glow-sky': '0 0 0 1px rgba(56, 189, 248, 0.35), 0 0 24px rgba(56, 189, 248, 0.18)',
        'glow-purple': '0 0 0 1px rgba(147, 51, 234, 0.35), 0 0 24px rgba(147, 51, 234, 0.18)',
        'glow-pink': '0 0 0 1px rgba(236, 72, 153, 0.35), 0 0 24px rgba(236, 72, 153, 0.18)',
        'glow-emerald': '0 0 0 1px rgba(16, 185, 129, 0.35), 0 0 24px rgba(16, 185, 129, 0.18)',
        'glow-amber': '0 0 0 1px rgba(245, 158, 11, 0.35), 0 0 24px rgba(245, 158, 11, 0.18)',
        'inner-lg': 'inset 0 2px 12px rgba(255,255,255,0.04), inset 0 -2px 32px rgba(0,0,0,0.35)',
        'inner-xl': 'inset 0 4px 20px rgba(255,255,255,0.06), inset 0 -4px 40px rgba(0,0,0,0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',

        'depth-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'depth-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'depth-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        'depth-4': '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        'depth-5': '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
        '5xl': '96px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',

        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
        'gradient-liquid': 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
      },
      backgroundSize: {
        'shimmer': '200% 100%',
      },
    },
  },
  plugins: [],
}
