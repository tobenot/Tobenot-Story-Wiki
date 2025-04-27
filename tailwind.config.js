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
        // 恢复 cosmic 名称，使用新的白/灰颜色值
        cosmic: {
          950: '#0F0F11', // 深黑
          900: '#141518', // 纯黑
          800: '#1C1C21', // 深灰黑
          700: '#26262D', // 深石墨
          600: '#303038', // 暗灰
          500: '#404046', // 中灰
          400: '#5A5A64', // 灰色
          300: '#7E7E8A', // 浅灰
          200: '#B0B0BA', // 银灰
          100: '#E0E0E6', // 亮灰
          50: '#F5F5F8',  // 几乎纯白
        },
        // 恢复 starlight 名称，使用新的金色系颜色值
        starlight: {
          950: '#2A2310', // 深金黑
          900: '#362B14', // 深橄榄金
          800: '#483A1C', // 暗金
          700: '#5E4A24', // 古铜
          600: '#8C7034', // 暗金黄
          500: '#AA894A', // 中金色
          400: '#C9A65E', // 浅金
          300: '#DBBD7D', // 淡金
          200: '#E9D4A4', // 米金
          100: '#F3E7C8', // 象牙金
          50: '#FCF8ED',  // 纯白光
        },
        // 恢复原有的颜色方案
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
        // 新增大理石颜色
        marble: {
          50: '#FFFFFF',
          100: '#F9F9F9',
          200: '#F0F0F0',
          300: '#E6E6E6',
          400: '#D9D9D9',
          500: '#CCCCCC',
          600: '#ABABAB',
          700: '#8A8A8A',
          800: '#595959',
          900: '#282828',
        },
      },
      // 更新阴影为粗野主义风格
      boxShadow: {
        'card': '6px 6px 0 0 rgba(15, 23, 42, 0.9)',
        'card-hover': '8px 8px 0 0 rgba(15, 23, 42, 0.9)',
        'glow': '0 0 0 2px rgba(162, 138, 235, 0.8)',
        'starlight': '6px 6px 0 0 rgba(170, 137, 74, 0.9)',
        'cosmic': '6px 6px 0 0 rgba(96, 74, 158, 0.9)',
        'brutal': '6px 6px 0 0 rgba(15, 23, 42, 0.9)',
        'brutal-lg': '10px 10px 0 0 rgba(15, 23, 42, 0.9)',
        'brutal-white': '6px 6px 0 0 rgba(255, 255, 255, 0.9)',
      },
      // 更新背景图案为大理石纹理
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(to bottom, #0A0514, #261A4D)',
        'star-field': 'radial-gradient(circle at top right, rgba(96, 74, 158, 0.15), rgba(10, 5, 20, 0) 70%)',
        'aurora': 'linear-gradient(to right, rgba(162, 138, 235, 0.2), rgba(96, 214, 181, 0.2), rgba(162, 138, 235, 0.2))',
        'galaxy': 'radial-gradient(ellipse at center, rgba(49, 37, 89, 0.3) 0%, rgba(10, 5, 20, 0) 70%)',
        'marble-pattern': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.9) 50%, rgba(230,230,230,0.9) 51%, rgba(245,245,245,0.9) 100%)',
        'marble-dark': 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(25,25,25,0.9) 50%, rgba(20,20,20,0.9) 51%, rgba(28,28,28,0.9) 100%)',
      },
      // 保持原有的 animation
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'starlight': 'starlight 4s ease-in-out infinite',
      },
      // 保持原有的 keyframes
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
      // 更新 typography
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
              borderLeftWidth: '4px',
              color: theme('colors.slate.700'),
              fontStyle: 'italic',
              backgroundColor: theme('colors.slate.50'),
              padding: theme('spacing.4'),
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
              borderLeftWidth: '4px',
              color: theme('colors.slate.400'),
              backgroundColor: theme('colors.slate.800'),
              padding: theme('spacing.4'),
            },
          },
        },
      }),
      // 添加自定义边框风格
      borderWidth: {
        '3': '3px',
        '6': '6px',
      },
    },
    // 确保默认无圆角
    borderRadius: {
      'none': '0',
      'DEFAULT': '0',
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}