// Doesn't remove unmatched plugins
import webpack from "webpack";

module.exports = {
  plugins: [
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.optimize.UglifyJsPlugin(),
	new webpack.optimize.DedupePlugin(),
  ],
};
