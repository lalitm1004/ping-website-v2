/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,svelte}'],
  theme: {
    extend: {
      colors: {
        'ping-pink': '#FF6B6B',
        'ping-orange-primary': '#FF6C16',
        'ping-orange-secondary': '#DF4A2F',
        'ping-gold': '#AC7426',
        'ping-beige': '#D5A669',
        'ping-red': '#FF0000',
      }
    },
  },
  plugins: [],
}

