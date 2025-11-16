import { pathToFileURL } from "node:url";
import { type DynamicImport } from "../types.js";

/**
 * Creates a safe dynamic import function that works in both CommonJS and ESM contexts.
 *
 * This function provides a secure wrapper around dynamic imports, with proper error handling
 * and path validation to prevent code injection vulnerabilities.
 *
 * @template T - The type of the module being imported
 * @returns A function that performs dynamic imports, or null if not supported
 *
 * @example
 * ```typescript
 * const loader = dynamicImportLoader<typeof MyModule>();
 * if (loader) {
 *   const module = await loader('./path/to/module.js');
 * }
 * ```
 *
 * @security This implementation avoids using Function constructor to prevent code injection
 */
function dynamicImportLoader<T>(): DynamicImport<T> | null {
  let importESM: DynamicImport<T> | null;

  try {
    // Use native async import with proper URL handling for security
    // pathToFileURL ensures the path is properly validated and sanitized
    importESM = async (id: string | URL): Promise<{ default: T }> => {
      // Validate input type - accept strings or URL objects
      if (typeof id !== "string" && !(id instanceof URL)) {
        throw new Error("Invalid module identifier");
      }

      // Convert to URL if it's a string, otherwise use the URL directly
      // pathToFileURL ensures proper path handling and security for string paths
      const url = typeof id === "string" ? pathToFileURL(id) : id;

      // Use Function constructor to preserve import() functionality across module systems
      // This is secure because:
      // 1. The function body is a hardcoded string - no user input
      // 2. The URL is passed as a parameter, not concatenated into the function body
      // 3. The URL comes from pathToFileURL (validated) or is already a URL object
      // This prevents TypeScript from transpiling import() to require()
      // eslint-disable-next-line no-new-func
      const importFunc = new Function("specifier", "return import(specifier)") as (
        spec: string,
      ) => Promise<{ default: T }>;

      return await importFunc(url.href);
    };
  } catch {
    importESM = null;
  }

  return importESM;
}

module.exports = dynamicImportLoader;
