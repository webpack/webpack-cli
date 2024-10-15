const path = require('path');
const <%= pluginIdentifier %> = require('../../src/index.js');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'example_dist'),
    filename: '[name].chunk.js',
  },
  plugins: [
    new <%= pluginIdentifier %>()
  ]
};
