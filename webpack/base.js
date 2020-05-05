const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const DotEnvPlugin = require("dotenv-webpack");

console.log(__dirname);

module.exports = {
  mode: "development",
  output: {
    path: path.join(__dirname, "../www"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["node_modules"],
    alias: {
      assets: path.join(__dirname, "assets/"),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: true,
      GAME_WIDTH: 435,
      GAME_HEIGHT: 720,
    }),
    new DotEnvPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, "../www/"),
    filename: "bundle.js",
    compress: true,
    port: 9000,
    inline: true,
    watchContentBase: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
      ignored: /node_modules/,
    },
  },
  module: {
    rules: [
      { test: /\.ts$/, enforce: "pre", loader: "eslint-loader" },
      { test: /assets(\/|\\)/, loader: "file-loader?name=assets/[hash].[ext]" },
      { test: /\.ts$/, loader: "ts-loader", exclude: "/node_modules/" }
    ],
  },
};
