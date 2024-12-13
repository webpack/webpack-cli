import { fileURLToPath } from "url";
import path from "path";

const mode = await "development";

export default {
  mode,
  entry: "./main.js",
  output: {
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist"),
    filename: "foo.bundle.js",
  },
};
