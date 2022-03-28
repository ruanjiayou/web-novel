const { override, fixBabelImports, addWebpackPlugin } = require('customize-cra')
const analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css',
  }),
  // addWebpackPlugin(new analyzer())
)