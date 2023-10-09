//webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "../src/index.jsx"),
    main: path.resolve(__dirname, "../electron/main.js"),
  },
  target: 'electron-renderer',
  output: {
    path: path.resolve(__dirname, "../appdist"),
    filename: "[name].[hash].js",
    chunkFilename: "[name].[chunkhash].js",
    assetModuleFilename: "assets/images/[hash][ext][query]"
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader", options: { retainLines: true, }, }
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        type: "asset/resource"
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  externals: {
    sqlite3: "commonjs sqlite3"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html")
    })
  ]
};