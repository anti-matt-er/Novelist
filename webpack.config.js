const SassThemeLoader = require("./src/sass-theme-loader");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ElectronReloadPlugin = require("webpack-electron-reload")({
  path: path.join(__dirname, "./dist/electron.js"),
});
const module_rules = [
  {
    test: /\.(js|jsx)$/,
    include: /src/,
    exclude: /(node_modules|bower_components)/,
    loader: "babel-loader",
    options: { presets: ["@babel/env"] },
  },
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"],
  },
  {
    test: /\.scss$/,
    use: [
      "style-loader",
      "css-loader",
      {
        loader: "sass-loader",
        options: {
          sassOptions: {
            functions: {
              "get($keys)": SassThemeLoader.getThemeItem,
            },
          },
        },
      },
    ],
  },
  {
    test: /\.md$/,
    use: [
      {
        loader: "html-loader",
      },
      {
        loader: "markdown-loader",
        options: {
          /* your options here */
        },
      },
    ],
  },
  {
    test: /\.(woff|ttf|otf|eot|woff2|svg)$/i,
    loader: "file-loader",
  },
];

module.exports = [
  {
    mode: "development",
    entry: "./src/electron.js",
    target: "electron-renderer",
    module: {
      rules: module_rules,
    },
    output: {
      path: __dirname + "/dist",
      filename: "electron.js",
    },
  },
  {
    mode: "development",
    entry: "./src/react.js",
    target: "electron-renderer",
    devtool: "source-map",
    module: {
      rules: module_rules,
    },
    output: {
      path: __dirname + "/dist",
      filename: "react.js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      ElectronReloadPlugin(),
    ],
  },
];
