import { fileURLToPath } from "node:url";
import path from "node:path";

export default {
  mode: "development",
  entry: "./main.js",
  output: {
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist"),
    filename: "foo.bundle.js",
  },
};
