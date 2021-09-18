let colorette = null;

module.exports = {

  get colors() {
    if (!colorette || colorette.options.changed) {
      const col = require('colorette');
      const options = {
        changed: false,
        enabled: colorette? colorette.options.enabled : true,
      }

      colorette = {
        ...col.createColors({ useColor: options.enabled }),
        options,
      }
    }

    return colorette;
  },

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

  get logger() {
    return require("./logger");
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
