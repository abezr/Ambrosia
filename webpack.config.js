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
    },
    {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
    }
    ]
  },
  output: {
    filename: 'app.js',
    path: './'
  }
};
