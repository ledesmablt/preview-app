const { colors: defaultColors } = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: {
    content: ['./src/**/*.html', './src/**/*.ts', './src/**/*.svelte'],
    enabled: 'production'
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      ...defaultColors,
      // https://gist.github.com/davidpiesse/74f5eaa23eb405e61b58cfe535d9907c
      orange: '#ff9800',
      'orange-50': '#fff3e0',
      'orange-100': '#ffe0b2',
      'orange-200': '#ffcc80',
      'orange-300': '#ffb74d',
      'orange-400': '#ffa726',
      'orange-500': '#ff9800',
      'orange-600': '#fb8c00',
      'orange-700': '#f57c00',
      'orange-800': '#ef6c00',
      'orange-900': '#e65100',
      'orange-100-accent': '#ffd180',
      'orange-200-accent': '#ffab40',
      'orange-400-accent': '#ff9100',
      'orange-700-accent': '#ff6d00'
    }
  },
  variants: {
    extend: {}
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  }
}
