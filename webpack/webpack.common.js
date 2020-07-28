const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (configDirs) {
  var module = {
    entry: configDirs.srcPath + '/bridgeWDC.js',
    output: {
      filename: 'bundle.js',
      path: configDirs.distPath,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          include: [configDirs.srcPath],
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Bridge API',
        filename: configDirs.distPath + '/index.html',
        template: configDirs.srcPath + '/index.ejs',
        inject: 'head',
      }),
      new MiniCssExtractPlugin({ filename: 'styles.css' }),
      new CleanWebpackPlugin(),
    ],
  };
  return module;
};
