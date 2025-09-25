/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Escanea todos los archivos relevantes en 'src'
  ],
  theme: {
    extend: {
       fontFamily: {
        sans: ['Inter', 'sans-serif'], // Usaremos una fuente más moderna
      },
    },
  },
  plugins: [],
}
