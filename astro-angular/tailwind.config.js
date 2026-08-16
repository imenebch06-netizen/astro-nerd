/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712', // Deep void background
          900: '#0f172a', // Glass card background
          card: '#1e1b4b', // Modal/Card primary accent[cite: 3]
          neonPurple: '#a855f7', // Glowing accent lines
          neonCyan: '#06b6d4',   // Interactive elements
        }
      }
    }
  },
  plugins: []
}