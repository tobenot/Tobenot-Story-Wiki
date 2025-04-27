/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 启用暗黑模式，基于类名
  theme: {
    extend: {
      colors: {
        // 宇宙主题色彩方案
        cosmic: {
          900: '#0A0514', // 深宇宙黑
          800: '#110A27', // 深空色
          700: '#1A1138', // 暗紫罗兰
          600: '#261A4D', // 深靛蓝
          500: '#312559', // 星云紫
          400: '#4A347A', // 中等紫罗兰
          300: '#624A9E', // 淡紫罗兰
          200: '#9079C6', // 薄雾紫
          100: '#BFB2E0', // 幻影紫
          50: '#EBE5F9',  // 星尘白
        },
        starlight: {
          900: '#342C1A', // 深琥珀
          800: '#594F2D', // 古铜色
          700: '#7F704F', // 暗金色
          600: '#A89670', // 中金色
          500: '#D0BC92', // 淡金色
          400: '#D5C9A6', // 象牙金（更深）
          300: '#DAD0B4', // 轻金丝（更深）
          200: '#E6DECB', // 珍珠色（更深）
          100: '#F0EAD9', // 星光色（更深）
          50: '#FFFCF7',  // 纯白光
        },
        // 保留原有颜色方案但做微调
        primary: {
          50: '#F0F7FF',
          100: '#E0F2FE',
          200: '#B9E6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },
        secondary: {
          50: '#F2F0FF',
          100: '#E8E0FF',
          200: '#D6C4FF',
          300: '#B89CFF',
          400: '#9A75FA',
          500: '#8256FF',
          600: '#7039ED',
          700: '#6029D9',
          800: '#5221B6',
          900: '#3A1591',
          950: '#220D65',
        },
        accent: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
          950: '#422006',
        },
      },
      boxShadow: {
        'card': '0 4px 12px rgba(49, 37, 89, 0.08)',
        'card-hover': '0 8px 24px rgba(49, 37, 89, 0.16)',
        'glow': '0 0 15px rgba(162, 138, 235, 0.5)',
        'starlight': '0 0 20px rgba(226, 214, 181, 0.6)',
        'cosmic': '0 0 25px rgba(96, 74, 158, 0.3)',
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(to bottom, #0A0514, #261A4D)',
        'star-field': 'radial-gradient(circle at top right, rgba(96, 74, 158, 0.15), rgba(10, 5, 20, 0) 70%)',
        'aurora': 'linear-gradient(to right, rgba(162, 138, 235, 0.2), rgba(96, 214, 181, 0.2), rgba(162, 138, 235, 0.2))',
        'galaxy': 'radial-gradient(ellipse at center, rgba(49, 37, 89, 0.3) 0%, rgba(10, 5, 20, 0) 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'starlight': 'starlight 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        starlight: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.secondary.500'),
              '&:hover': {
                color: theme('colors.secondary.600'),
              },
            },
            h1: {
              color: theme('colors.slate.900'),
              fontWeight: '700',
              letterSpacing: '0.025em',
            },
            h2: {
              color: theme('colors.slate.900'),
              fontWeight: '600',
              letterSpacing: '0.015em',
            },
            h3: {
              color: theme('colors.slate.900'),
              fontWeight: '600',
            },
            blockquote: {
              borderLeftColor: theme('colors.secondary.300'),
              color: theme('colors.slate.700'),
              fontStyle: 'italic',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.slate.300'),
            a: {
              color: theme('colors.secondary.400'),
              '&:hover': {
                color: theme('colors.secondary.300'),
              },
            },
            h1: {
              color: theme('colors.white'),
            },
            h2: {
              color: theme('colors.white'),
            },
            h3: {
              color: theme('colors.white'),
            },
            blockquote: {
              borderLeftColor: theme('colors.secondary.500'),
              color: theme('colors.slate.400'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}