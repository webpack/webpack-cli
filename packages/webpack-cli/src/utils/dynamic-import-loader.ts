import { type DynamicImport } from "../types.js";

function dynamicImportLoader<T>(): DynamicImport<T> | null {
  let importESM;

  try {
    // eslint-disable-next-line no-new-func
    importESM = new Function("id", "return import(id);");
  } catch {
    importESM = null;
  }

  return importESM as DynamicImport<T>;
}

module.exports = dynamicImportLoader;
