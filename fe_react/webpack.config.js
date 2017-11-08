'use strict';

module.exports = {
    entry: './Index',
    output: {
        filename: './production/build.js'
    },

    watch: true,
    devtool: "source-map",
    
    module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015','react']
          }
        },
        {
          test:   /\.css$/,
          loader: "style-loader!css-loader"
        }]
    }
}