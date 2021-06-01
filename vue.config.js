module.exports = {
  publicPath: './',
  outputDir: 'dist',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/variables.scss";'
      }
    },
    sourceMap: true
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'production') { // 开发环境配置
      config.devtool = 'inline-source-map';
    }
  },
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/ai': {
        target: 'http://192.168.1.225',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/ai': 'ai'
        }
      }
    }
  }
};
