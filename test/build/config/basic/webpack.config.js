const { resolve } = require("node:path");

module.exports = {
  entry: "./a.js",
  output: {
    path: resolve(__dirname, "binary"),
    filename: "a.bundle.js",
  },
};
