import path from "node:path";
import { fileURLToPath } from "node:url";

// eslint-disable-next-line unicorn/no-unnecessary-await
const mode = await "development";

export default {
  mode,
  entry: "./main.js",
  output: {
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist"),
    filename: "foo.bundle.js",
  },
};
