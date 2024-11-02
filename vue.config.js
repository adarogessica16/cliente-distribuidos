const { defineConfig } = require('@vue/cli-service'); // Si usas Vue CLI
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8040',
        changeOrigin: true,
      },
      '/api/categorias': {
        target: 'http://localhost:8040',
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // Flag necesaria para Vue esm-bundler
      }),
    ],
  },
});





