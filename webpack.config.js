var path = require('path');

module.exports = {
  entry: './src/client.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'client.js'
  },
  module: {
    loaders: [
      { loader: 'babel-loader', exclude: /node_modules/, test: /\.js?$/ }
    ]
  }
};