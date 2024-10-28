// vue.config.js
// vue.config.js
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8040',
        changeOrigin: true,
      },
    },
  },
});


