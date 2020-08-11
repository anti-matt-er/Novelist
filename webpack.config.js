const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
        mode: "development",
        entry: "./src/electron.js",
        target: 'electron-renderer',
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              include: /src/,
              exclude: /(node_modules|bower_components)/,
              loader: "babel-loader",
              options: { presets: ["@babel/env"] }
            },
            {
              test: /\.css$/,
              use: ["style-loader", "css-loader"]
            }
          ]
        },
        output: {
          path: path.resolve(__dirname, "dist/"),
          publicPath: "/dist/",
          filename: "electron.js"
        }
    },
    {
        mode: 'development',
        entry: './src/react.js',
        target: 'electron-renderer',
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include: /src/,
                    exclude: /(node_modules|bower_components)/,
                    loader: "babel-loader",
                    options: { presets: ["@babel/env"] }
                },
                {
                  test: /\.css$/,
                  use: ["style-loader", "css-loader"]
                }
            ]
        },
        output: {
          path: __dirname + '/dist',
          filename: 'react.js'
        },
        plugins: [
          new HtmlWebpackPlugin({
            template: './public/index.html'
          })
        ]
      }
];