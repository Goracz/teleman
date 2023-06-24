/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#1C49EC',
      },
    }
  },
  plugins: [],
  variants: {
    extend: {
      content: ['responsive'],
    },
  },
}
