/* eslint-disable node/no-unsupported-features/es-syntax */
/** eslint-disable **/
import * as path from "path";

const config = {
  mode: "production",
  entry: "./main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "foo.bundle.js",
  },
};

export = config;
