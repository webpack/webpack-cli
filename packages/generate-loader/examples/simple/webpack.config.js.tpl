const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'example_dist'),
    filename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'example-loader',
            options: {},
          },
        ],
      },
    ],
  },
  resolveLoader: {
    alias: {
      'example-loader': require.resolve('../../src/'),
    },
  },
};
