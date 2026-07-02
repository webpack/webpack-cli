const path = require("node:path");

const filename: string = "foo.bundle.js";

const config = {
  entry: "./main.ts",
  output: {
    path: path.resolve("dist"),
    filename,
  },
};

module.exports = config;
