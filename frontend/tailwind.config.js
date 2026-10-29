/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Paleta tomada del logo de Pet Market Club
      colors: {
        azul: { DEFAULT: '#1F4266', suave: '#4A7098', tinte: '#E8F0F8' },
        naranja: { DEFAULT: '#F79A3E', fuerte: '#E08430', tinte: '#FFF1E1' },
        crema: '#FFFBF5',
        linea: '#EDE4D7',
        verde: '#4E9C74',
        rojo: '#CF6F57',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
