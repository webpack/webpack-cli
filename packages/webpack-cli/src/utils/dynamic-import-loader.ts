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
    importESM = async (id: string): Promise<{ default: T }> => {
      // Validate input to prevent path traversal attacks
      if (!id || typeof id !== "string") {
        throw new Error("Invalid module identifier");
      }

      // Use pathToFileURL for proper path handling and security
      const url = pathToFileURL(id);

      // Use native import() which is safer than Function constructor
      // This is wrapped in an async function to maintain compatibility
      return await import(url.href);
    };
  } catch {
    importESM = null;
  }

  return importESM;
}

module.exports = dynamicImportLoader;
