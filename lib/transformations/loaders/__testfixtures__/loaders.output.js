export default [{
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    }]
  }
}, {
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',

        options: {
          modules: true
        }
      }]
    }]
  }
}, {
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          modules: true
        }
      }]
    }]
  }
}]