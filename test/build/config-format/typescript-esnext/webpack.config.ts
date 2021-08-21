/* eslint-disable node/no-unsupported-features/es-syntax */
import * as path from "path";

const config = {
  mode: "production",
  entry: "./main.ts",
  output: {
    path: path.resolve("dist"),
    filename: "foo.bundle.js",
  },
};

export default config;
