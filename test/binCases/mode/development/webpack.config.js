var webpack = require("webpack");
var path = require("path");

console.log(webpack.mode);
module.exports = {
  entry: path.resolve(__dirname, "./index")
};
