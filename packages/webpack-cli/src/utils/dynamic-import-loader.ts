// eslint-disable-next-line @typescript-eslint/ban-types
function dynamicImportLoader<T = any>(): Function | null {
  let importESM;

  try {
    importESM = new Function("id", "return import(id);");
  } catch (e) {
    importESM = null;
  }

  return importESM;
}

module.exports = dynamicImportLoader;
