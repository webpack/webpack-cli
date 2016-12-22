export default [{
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  }
}, {
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules=true'
    }]
  }
}, {
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        query: {
          modules: true
        }
      }]
    }]
  }
}]