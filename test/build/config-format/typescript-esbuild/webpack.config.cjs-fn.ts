const path = require("node:path");

// cspell:ignore elopment
module.exports = () => ({
  mode: "development",
  entry: "./main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "foo.bundle.js",
  },
});
