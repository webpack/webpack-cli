// This should throw
import webpack from "webpack";

export default (config) => {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  return config;
};
