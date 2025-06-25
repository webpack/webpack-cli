const path = require("node:path");

module.exports = async () => ({
  entry: "./a",
  output: {
    path: path.resolve(__dirname, "./binary"),
    filename: "functor.js",
  },
});
