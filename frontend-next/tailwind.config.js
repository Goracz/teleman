/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#1C49EC',
        'accent-red': '#FF1A1A',
        'accent-orange': '#FF8A00',
        'accent-purple': '#9E00FF',
        'accent-green': '#1ED760',
      },
      gridTemplateRows: {
        'layout': 'auto 1fr auto'
      }
    }
  },
  plugins: [],
  variants: {
    extend: {
      content: ['responsive'],
    },
  },
}
