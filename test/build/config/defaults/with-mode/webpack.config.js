const { resolve } = require("node:path");

module.exports = {
  entry: "./index.js",
  output: {
    path: resolve(__dirname, "./binary"),
    filename: "dev.bundle.js",
  },
};
