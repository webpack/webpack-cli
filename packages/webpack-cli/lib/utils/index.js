module.exports = {
  get levenshtein() {
    return require("fastest-levenshtein");
  },

  get interpret() {
    return require("interpret");
  },

  get rechoir() {
    return require("rechoir");
  },

  get capitalizeFirstLetter() {
    return require("./capitalize-first-letter");
  },

  get dynamicImportLoader() {
    return require("./dynamic-import-loader");
  },

  get getAvailableInstallers() {
    return require("./get-available-installers");
  },

  get getPackageManager() {
    return require("./get-package-manager");
  },

  get packageExists() {
    return require("./package-exists");
  },

  get promptInstallation() {
    return require("./prompt-installation");
  },

  get runCommand() {
    return require("./run-command");
  },

  get toKebabCase() {
    return require("./to-kebab-case");
  },
};
