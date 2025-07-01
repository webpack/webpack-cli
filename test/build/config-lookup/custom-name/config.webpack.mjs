import path from "node:path";
import { fileURLToPath } from "node:url";

export default {
  entry: "./a.js",
  output: {
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist"),
    filename: "a.bundle.js",
  },
};
