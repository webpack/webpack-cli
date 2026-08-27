import { join } from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Resolves a bare specifier from the `node_modules` directory of the current working directory.
 * @param {string} specifier module specifier
 * @param {Error & { code?: string }} err error thrown by the next resolve hook
 * @returns {{ url: string, shortCircuit: boolean }} resolution result
 */
function resolveFromCwd(specifier, err) {
  if (err.code === "ERR_MODULE_NOT_FOUND" && !specifier.startsWith(".")) {
    const baseDir = join(process.cwd(), "node_modules/");
    const resolved = join(baseDir, specifier, "index.js");

    return {
      url: pathToFileURL(resolved).href,
      shortCircuit: true,
    };
  }

  throw err;
}

// Asynchronous hook, used with `module.register()`
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    return resolveFromCwd(specifier, err);
  }
}

// Synchronous hook, used with `module.registerHooks()`
export function resolveSync(specifier, context, nextResolve) {
  try {
    return nextResolve(specifier, context);
  } catch (err) {
    return resolveFromCwd(specifier, err);
  }
}
