import path from "node:path";

/* eslint-disable no-useless-concat */

const filename: string = "bar" + ".bundle.js";

export default {
  entry: "./main.ts",
  output: {
    path: path.resolve("dist"),
    filename,
  },
};
