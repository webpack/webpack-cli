import { join } from "node:path";
import { pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND" && !specifier.startsWith(".")) {
      try {
        const baseDir = join(process.cwd(), "node_modules/");
        const resolved = join(baseDir, specifier, "index.js");

        return {
          url: pathToFileURL(resolved).href,
          shortCircuit: true,
        };
      } catch {
        throw err;
      }
    }
    throw err;
  }
}
