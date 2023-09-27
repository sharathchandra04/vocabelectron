// webpack.dev.config.js
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.config.js");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const devConfig = merge(commonConfig, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    port: 3000,
    hot: true,
    devMiddleware: {
      publicPath: '/'
    },
    historyApiFallback: true
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new NodePolyfillPlugin()
  ]
});

module.exports = devConfig;