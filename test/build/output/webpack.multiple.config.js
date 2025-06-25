const { resolve } = require("node:path");

module.exports = {
  entry: {
    b: "./b.js",
    c: "./c.js",
  },
  output: {
    path: resolve(__dirname, "bin"),
    filename: "[name].bundle.js",
  },
  mode: "development",
};
