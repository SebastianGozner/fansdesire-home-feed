// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#f0e6ff",
          200: "#d1beff",
          300: "#b197ff",
          400: "#906dff",
          500: "#7047ff", // Main primary color
          600: "#5a33ff",
          700: "#4320ff",
          800: "#2c00ff",
          900: "#2400cc",
        },
        secondary: {
          100: "#fff0f3",
          200: "#ffd6e0",
          300: "#ffadbe",
          400: "#ff85a1",
          500: "#ff5c84", // Main secondary color
          600: "#ff3366",
          700: "#ff0a49",
          800: "#e6003c",
          900: "#cc0035",
        },
        dark: {
          100: "#d5d5d5",
          200: "#ababab",
          300: "#808080",
          400: "#565656",
          500: "#2b2b2b", // Main dark color
          600: "#232323",
          700: "#1a1a1a",
          800: "#121212",
          900: "#090909",
        },
      },
      fontSize: {
        'xxs': '.65rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
}
