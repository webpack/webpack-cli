const { resolve } = require("node:path");

module.exports = {
  entry: resolve("./a.js"),
  output: {
    path: resolve(__dirname, "binary"),
    filename: "a.bundle.js",
  },
};
