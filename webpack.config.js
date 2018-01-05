/*
    ./webpack.config.js
*/
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
})

// how to bundle fonts
// https://shellmonger.com/2016/01/22/working-with-fonts-with-webpack/
let conf = {
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      // { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader' },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=80000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=80000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=80000&mimetype=image/svg+xml' }
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default'],
        // In case you imported plugins individually, you must also require them here:
        Util: "exports-loader?Util!bootstrap/js/dist/util",
        Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
        // ...
      })
  ],
  node: {
   fs: 'empty'
  },
  resolve: {
    alias: {
      // https://github.com/lorenwest/node-config/wiki/Webpack-Usage
      config: path.resolve(__dirname, 'config/default.json')
      // url: 'universal-url'
    }
  }
}

module.exports = [
  Object.assign({}, conf, {
    entry: './client/index.js',
    output: {
      path: path.resolve('dist'),
      filename: 'index.js'
    }
  }),
  Object.assign({}, conf, {
    entry: './client/sdk.js',
    output: {
      path: path.resolve('dist'),
      filename: 'sdk.js',
      libraryTarget: 'var',
      library: 'Breadboard'
    }
  }),
  Object.assign({}, conf, {
    entry: './client/sdk.js',
    output: {
      path: path.resolve('dist'),
      filename: 'module.js',
      libraryTarget: 'commonjs',
      library: 'Breadboard'
    }
  })
]
