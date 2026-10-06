/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366f1', // Indigo
          secondary: '#4f46e5',
          accent: '#f43f5e', // Rose
          dark: '#0f172a', // Slate-900
          light: '#f8fafc', // Slate-50
        },
      },
    },
  },
  plugins: [],
}
