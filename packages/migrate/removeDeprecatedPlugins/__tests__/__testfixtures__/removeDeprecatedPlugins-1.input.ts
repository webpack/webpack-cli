// Works for DedupePlugin
import webpack from "webpack";

module.exports = {
  plugins: [new webpack.optimize.DedupePlugin()],
};
