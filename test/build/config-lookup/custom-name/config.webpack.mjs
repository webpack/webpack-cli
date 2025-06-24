import { fileURLToPath } from "node:url";
import path from "node:path";

export default {
  entry: "./a.js",
  output: {
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist"),
    filename: "a.bundle.js",
  },
};
