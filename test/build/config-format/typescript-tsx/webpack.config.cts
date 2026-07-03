const path = require("node:path");

/* eslint-disable no-useless-concat */

const filename: string = "qux" + ".bundle.js";

const config = {
  entry: "./main.ts",
  output: {
    path: path.resolve("dist"),
    filename,
  },
};

module.exports = config;
