const webpack = require('webpack');
const path = require('path');

const config = {
  entry: {
    module: `${__dirname}/src/js/index.js`,
  },
  output: {
    path: `${__dirname}/public/js/`,
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
};

module.exports = config;