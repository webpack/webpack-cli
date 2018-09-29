import webpack from "webpack";
module.exports = {
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
};
