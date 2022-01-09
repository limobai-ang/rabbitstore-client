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
  }
}
