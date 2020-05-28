const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');
const DotEnvPlugin = require("dotenv-webpack");

module.exports = {
  mode: "development",
  output: {
    path: path.join(__dirname, "../www/"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["node_modules"],
    alias: {
      "@": path.join(__dirname, "../src/"),
      assets: path.join(__dirname, "../assets/"),
    },
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildStart: ['node ./scripts/generateAssetsClass.js --dev']
    }),
    new CopyWebpackPlugin([{
      from: 'locales', to: 'locales'
  }]),
  new webpack.DefinePlugin({
      DEBUG: true,
      GAME_WIDTH: 540,
      GAME_HEIGHT: 960,
    }),
    new DotEnvPlugin(),
  ],
  devServer: {
    contentBase: "www",
    filename: "bundle.js",
    compress: true,
    port: 9000,
    inline: true,
    open: true,
    watchContentBase: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
      ignored: /node_modules/,
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: "pre",
        loader: "eslint-loader"
      },
      {
        test: /assets(\/|\\)/,
        type: 'javascript/auto',
        use: [{
          loader: "file-loader",
          options: { name: "assets/[hash].[ext]" }
        }]
      },
      {
        test: /\.ts$/,
        exclude: "/node_modules/",
        use: [{ loader: "ts-loader" }]
      }
    ],
  },
};
