module.exports = {
  entry: './client/main.js',
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/,
      query: {
        presets: ['react', 'es2015', 'stage-0'],
        plugins: ['./build/BabelGraphQLPlugin', 'transform-class-properties']
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
