module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname,
    filename: '_bundle.js'
  },
  $comment$module: {
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

