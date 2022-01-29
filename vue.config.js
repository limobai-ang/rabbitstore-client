const path = require('path')
module.exports = {
  pluginOptions: {
    // 通过vue-resources-loader完成代码注入再每个less文件和vue组件中
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/style/mixins.less'),
        path.join(__dirname, './src/assets/style/variables.less')
      ]
    }
  },
  // 这个是给webpack-dev-server开启可IP和域名访问权限。
  chainWebpack: config => {
    config.devServer.disableHostCheck(true)
  },
  // 这个是设置外部扩展，模块为qc变量名为QC，导入qc将不做打包。 (减少打包体积)
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  }
}
