module.exports = {
  mode: 'spa',
  server: {
    port: 15953,
  },
  buildDir: '../dist/.nuxt',
  generate: {
    dir: '../dist/renderer',
  },
  srcDir: '../src/renderer',
  build: {
    extend(config, { isClient }) {
      if (isClient) {
        config.target = 'electron-renderer';
      }
    },
  },
  css: ['~/assets/main.css'],
  head: {
    title: 'DMX PowerPoint Control',
  },
};
