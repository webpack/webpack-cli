const { resolve } = require("node:path");

module.exports = {
  entry: "./a.js",
  mode: "development",
  output: {
    path: resolve(__dirname, "bin"),
    filename: "a.bundle.js",
  },
};
