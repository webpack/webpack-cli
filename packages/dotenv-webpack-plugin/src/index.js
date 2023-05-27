const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const { DefinePlugin } = require("webpack");
const { validate } = require("schema-utils");
const schema = require("./options.json");

/** @typedef {import("./types").Config} Config */
/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */

class DotenvWebpackPlugin {
  /**
   * Dotenv Webpack Plugin
   * @param {Config} options - Configuration options
   */
  constructor(options = {}) {
    validate(/** @type {Schema} */ (schema), options || {}, {
      name: "DotenvWebpackPlugin",
      baseDataPath: "options",
    });

    const currentDirectory = process.cwd();

    this.defaultFileList = [
      `${currentDirectory}/.env.example`, // loaded in all cases
      `${currentDirectory}/.env`, // loaded in all cases
      `${currentDirectory}/.env.[mode]`, // only loaded in specified mode
      `${currentDirectory}/.env.local`, // loaded in all cases, ignored by git
      `${currentDirectory}/.env.[mode].local`, // only loaded in specified mode, ignored by git
    ];

    const {
      // priority is in ascending order
      // files at the end of the array have higher priority
      envFiles = this.defaultFileList,
      prefixes = ["process.env.", "import.meta.env."],
      envVarPrefix = "PUBLIC_",
      allowEmptyValues = false,
    } = options;

    this.options = {
      envFiles,
      prefixes,
      envVarPrefix,
      allowEmptyValues,
    };

    this.errors = [];
  }

  /**
   * Default file list and the options file list are updated with the
   * value of the mode if [mode] placeholder is used
   * @param {String} mode - Webpack mode
   */
  updateFileListWithMode(mode) {
    this.options.envFiles = this.options.envFiles.map((environmentFile) =>
      environmentFile.replace(/\[mode\]/g, mode),
    );
    this.defaultFileList = this.defaultFileList.map((environmentFile) =>
      environmentFile.replace(/\[mode\]/g, mode),
    );
  }

  /**
   * Read file from path and parse it
   * @param {Compiler} compiler - Webpack compiler
   * @param {string} environmentFile - Path to environment file
   */
  readFile(compiler, environmentFile) {
    return new Promise((resolve, reject) => {
      const fs = compiler.inputFileSystem;

      fs.readFile(environmentFile, (err, environmentFileContents) => {
        if (err) {
          if (!this.defaultFileList.includes(environmentFile)) {
            this.collectError(`Could not read ${environmentFile}`);
            return reject(err);
          } else {
            return resolve();
          }
        }

        const parsedEnvVariables = dotenv.parse(environmentFileContents);

        resolve(parsedEnvVariables);
      });
    });
  }

  filterVariables(envVariables) {
    const filteredEnvVariables = {};

    for (const [key, value] of Object.entries(envVariables)) {
      // only add variables starting with the provided prefix
      if (key.startsWith(this.options.envVarPrefix)) {
        filteredEnvVariables[key] = value;
      }
    }

    return filteredEnvVariables;
  }

  assignPrefixes(envVariables) {
    const prefixedEnvVariables = {};

    for (const [key, value] of Object.entries(envVariables)) {
      for (let index = 0; index < this.options.prefixes.length; index++) {
        const prefix = this.options.prefixes[index];
        prefixedEnvVariables[`${prefix}${key}`] = value;
      }
    }

    return prefixedEnvVariables;
  }

  /**
   * Throw collected errors to fail the build
   * @param {Compilation} compilation - Webpack compilation
   */
  throwErrors(compilation) {
    compilation.errors.push(...this.errors);
  }

  collectError(errorMessage) {
    this.errors.push(errorMessage);
  }

  /**
   * Get list of empty values
   * @param {Object} envVariables - Environment variables
   * @returns {Array} - List of empty values
   */
  getEmptyValues(envVariables) {
    const emptyValues = [];

    for (const [key, value] of Object.entries(envVariables)) {
      if (value === "") {
        emptyValues.push(key);
      }
    }

    return emptyValues;
  }

  /**
   * Webpack apply hook
   * @param {Compiler} compiler - Webpack compiler
   * @returns {void}
   */
  apply(compiler) {
    const mode = compiler.options.mode || "production";
    this.updateFileListWithMode(mode);

    compiler.hooks.beforeRun.tapPromise("DotenvWebpackPlugin", (compiler) => {
      compiler.hooks.compilation.tap("DotenvWebpackPlugin", (compilation) => {
        compilation.buildDependencies.addAll(this.options.envFiles);
        if (this.errors.length > 0) {
          this.throwErrors(compilation);
        }
      });

      return Promise.all(
        this.options.envFiles.map((environmentFile) => this.readFile(compiler, environmentFile)),
      )
        .then((valuesList) => {
          const envVariables = {};

          valuesList.forEach((values) => {
            if (values) {
              Object.entries(values).forEach(([key, value]) => {
                envVariables[key] = value;
              });
            }
          });

          const filteredEnvVariables = this.filterVariables(envVariables);

          const emptyValues = this.getEmptyValues(filteredEnvVariables);

          if (!this.options.allowEmptyValues && emptyValues.length > 0) {
            this.collectError(
              `Environment variables cannot have an empty value. The following variables are empty: ${emptyValues.join(
                ", ",
              )}`,
            );
            return;
          }

          const prefixedEnvVariables = this.assignPrefixes(filteredEnvVariables);

          // expand environment vars
          const expandedEnvVariables = dotenvExpand.expand({
            parsed: prefixedEnvVariables,
            // don't write to process.env
            ignoreProcessEnv: true,
          }).parsed;

          new DefinePlugin(expandedEnvVariables).apply(compiler);
        })
        .catch(() => {});
    });
  }
}

module.exports = DotenvWebpackPlugin;
