import * as path from "node:path";

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

export default config;
