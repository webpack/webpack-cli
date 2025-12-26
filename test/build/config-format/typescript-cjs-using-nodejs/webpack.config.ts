const path = require("node:path");

/* eslint-disable no-useless-concat */

// cspell:ignore elopment
const mode: string = "dev" + "elopment";
const config = {
  mode,
  entry: "./main.ts",
  output: {
    path: path.resolve("dist"),
    filename: "foo.bundle.js",
  },
};

module.exports = config;
