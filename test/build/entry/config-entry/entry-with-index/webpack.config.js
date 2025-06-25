const path = require("node:path");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/app.js",
    print: "./src/print.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
