/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'twilio-red': '#ff1233',
        'twilio-dark': '#000d25',
        'twilio-white': '#ffffff',
        'twilio-navy': '#081f47',
        'twilio-blue': '#1866ee',
        'twilio-dark-red': '#430b12',
        'twilio-medium-red': '#b10f23',
        'twilio-light-red': '#db132a',
        'twilio-gray': '#4d5777',
        'twilio-light-gray': '#dde0e6',
        'twilio-dark-blue': '#191f36',
        'twilio-pink': '#f77786',
      },
      fontFamily: {
        'buffalo': ['"Courier New"', '"Buffalo BF"', 'impact', '"Arial Black"', 'sans-serif'],
        'twilio-text': ['"Courier New"', '"Twilio Sans Text"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'twilio-mono': ['"Courier New"', '"Twilio Sans Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}