const {
  override,
  fixBabelImports,
  addWebpackPlugin,
} = require('customize-cra');
const analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css',
  }),
  addWebpackPlugin(
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './sw-template.js',
      swDest: 'sw-build.js',
    }),
  ),
  // addWebpackPlugin(new analyzer())
);
