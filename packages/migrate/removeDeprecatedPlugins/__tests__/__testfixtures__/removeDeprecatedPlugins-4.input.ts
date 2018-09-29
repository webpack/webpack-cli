// This should throw
import webpack from "webpack";

const inst = new webpack.optimize.OccurrenceOrderPlugin();
export default (config) => {
  config.plugins = [inst];
  return config;
};
