/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'charcoal': '#1A1A1A',
        'slate-custom': '#0F172A',
        'slate-light': '#1E293B',
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#1E3A8A",
          "secondary": "#047857", 
          "accent": "#3B82F6",
          "neutral": "#1A1A1A",
          "base-100": "#FFFFFF",
          "base-200": "#F8F9FA",
          "base-300": "#F5F5F7",
          "info": "#3B82F6",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
        dark: {
          "primary": "#3B82F6",
          "secondary": "#10B981",
          "accent": "#8B5CF6", 
          "neutral": "#F9FAFB",
          "base-100": "#0F172A",
          "base-200": "#1E293B",
          "base-300": "#374151",
          "info": "#3B82F6",
          "success": "#10B981", 
          "warning": "#F59E0B",
          "error": "#EF4444",
        }
      }
    ],
  },
}