module.exports = {
  mode: 'jit',
  purge: {
    content: ['./src/**/*.html', './src/**/*.ts', './src/**/*.svelte'],
    enabled: 'production'
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
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
