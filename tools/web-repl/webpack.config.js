var path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    path: './',
    filename: '_bundle.js'
  },
  $module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { presets: [ 'es2015' ] }
      }
    ]
  }
};

