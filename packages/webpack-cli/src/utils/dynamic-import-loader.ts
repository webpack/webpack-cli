import { DynamicImport } from "../types";

function dynamicImportLoader<T>(): DynamicImport<T> | null {
  let importESM;

  try {
    importESM = new Function("id", "return import(id);");
  } catch (e) {
    importESM = null;
  }

  return importESM as DynamicImport<T>;
}

module.exports = dynamicImportLoader;
