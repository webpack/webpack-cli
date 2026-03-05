import * as path from "node:path";

const mode = "development";
const config = {
  mode,
  entry: "./main.js",
  output: {
    path: path.resolve("dist"),
    filename: "foo.bundle.js",
  },
};

export default config;
