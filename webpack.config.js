module.exports = {
  entry: './src/client/main.js',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: {
        stage: 0,
        plugins: ['./build/BabelGraphQLPlugin']
      }
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass'
    }]
  },
  output: {
    filename: 'app.js',
    path: './src/'
  }
};
