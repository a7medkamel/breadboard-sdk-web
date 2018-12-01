/*
    ./webpack.config.js
*/
const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
})

const StringReplacePlugin = require('string-replace-webpack-plugin');

let conf = {
  module: {
    rules: [
      {
          test: /\.js$/
        , exclude: [/node_modules/, /dist/]
        , use: [
            { loader: "babel-loader" },
            { loader: StringReplacePlugin.replace({
                      replacements: [
                        {
                          pattern: /!new.target/ig,
                          replacement: (match, p1, offset, string) => 'new.target === undefined'
                        }
                      ]})
                    }
          ]
      },
      {
          test: /\.jsx$/
        , use: { loader: "babel-loader" }
      },
      {
          test: /\.css$/
        , use: { loader : "css-loader" }
      },
      { test: /\.png$/, use: { loader: "url-loader?limit=100000" } },
      { test: /\.jpg$/, use: { loader: "file-loader" } },
      {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/
        , use: { loader: 'url-loader?limit=80000&mimetype=application/font-woff' }
      },
      {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/
        , use: { loader: 'url-loader?limit=80000&mimetype=application/octet-stream' }
      },
      {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/
        , use: { loader: 'file-loader' }
      },
      {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/
        , use: { loader: 'url-loader?limit=80000&mimetype=image/svg+xml' }
      }
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
        Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown"
      }),
    new StringReplacePlugin()
  ],
  node: {
   fs: 'empty',
   net: 'empty',
   tls: 'empty',
   chai: 'empty',
   express: 'empty',
   'express-ws': 'empty',
   'node-pty': 'empty'
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
  // Object.assign({}, conf, {
  //   entry: './client/sdk.js',
  //   output: {
  //     path: path.resolve('dist'),
  //     filename: 'commonjs.js',
  //     libraryTarget: 'commonjs',
  //     library: 'Breadboard'
  //   }
  // }),
  // Object.assign({}, conf, {
  //   entry: './client/sdk.js',
  //   output: {
  //     path: path.resolve('dist'),
  //     filename: 'umd.js',
  //     libraryTarget: 'umd',
  //     library: 'Breadboard'
  //   }
  // })
]
