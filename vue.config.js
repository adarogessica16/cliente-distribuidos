const { defineConfig } = require('@vue/cli-service'); // Si usas Vue CLI
const webpack = require('webpack');
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/cliente-distribuidos/' : '/',
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8040',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8040',
        changeOrigin: true,
      },
    },
    historyApiFallback: true, 
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],
  },
  outputDir: 'dist', 
});





