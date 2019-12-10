module.exports = {
  publicPath: './',
  devServer: {
    port: 5400,
    open: true,
  },
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    output: {
      filename: 'js/[name].[hash:8].min.js',
      chunkFilename: 'js/[name].[hash:8].min.js'
    }
  }
}