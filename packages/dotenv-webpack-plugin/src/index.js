const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const { DefinePlugin } = require("webpack");
const { validate } = require("schema-utils");
const schema = require("./options.json");

/** @typedef {import("./types").Config} Config */
/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import("webpack").Compiler} Compiler */

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

    const {
      envFiles = [
        `${currentDirectory}/.env.example`, // loaded in all cases
        `${currentDirectory}/.env`, // loaded in all cases
        `${currentDirectory}/.env.local`, // loaded in all cases, ignored by git
        `${currentDirectory}/.env.[mode]`, // only loaded in specified mode
        `${currentDirectory}/.env.[mode].local`, // only loaded in specified mode, ignored by git
      ],
      prefixes = ["process.env.", "import.meta.env."],
    } = options;

    this.options = {
      envFiles,
      prefixes,
    };
  }

  /**
   * Read file from path and parse it
   * @param {Compiler} compiler - Webpack compiler
   * @param {string} environmentFile - Path to environment file
   */
  readFile(compiler, environmentFile) {
    return new Promise((resolve, reject) => {
      const envVariables = {};

      const fs = compiler.inputFileSystem;

      fs.stat(environmentFile, (err) => {
        // File does not exist
        if (err) {
          return resolve();
        }

        fs.readFile(environmentFile, (err, environmentFileContents) => {
          if (err) {
            const logger = compiler.getInfrastructureLogger("DotenvWebpackPlugin");
            logger.error(`Could not read ${environmentFile}`);
            return reject(err);
          }

          const parsedEnvVariables = dotenv.parse(environmentFileContents);
          for (const [key, value] of Object.entries(parsedEnvVariables)) {
            // only add variables starting with WEBPACK_
            if (key.startsWith("WEBPACK_")) {
              for (let index = 0; index < this.options.prefixes.length; index++) {
                const prefix = this.options.prefixes[index];
                envVariables[`${prefix}${key}`] = value;
              }
            }
          }

          resolve(envVariables);
        });
      });
    });
  }

  /**
   * Webpack apply hook
   * @param {Compiler} compiler - Webpack compiler
   * @returns {void}
   */
  apply(compiler) {
    const mode = compiler.options.mode || "production";

    const environmentFiles = this.options.envFiles.map((environmentFile) =>
      environmentFile.replace(/\[mode\]/g, mode),
    );

    compiler.hooks.beforeRun.tapPromise("DotenvWebpackPlugin", (compiler) => {
      compiler.hooks.compilation.tap("DotenvWebpackPlugin", (compilation) => {
        compilation.buildDependencies.addAll(environmentFiles);
      });

      return Promise.all(
        environmentFiles.map((environmentFile) => this.readFile(compiler, environmentFile)),
      )
        .then((valuesList) => {
          let envVariables = {};

          valuesList.forEach((values) => {
            if (values) {
              Object.entries(values).forEach(([key, value]) => {
                envVariables[key] = value;
              });
            }
          });

          // expand environment vars
          envVariables = dotenvExpand.expand({
            parsed: envVariables,
            // don't write to process.env
            ignoreProcessEnv: true,
          }).parsed;

          new DefinePlugin(envVariables).apply(compiler);
        })
        .catch(() => {});
    });
  }
}

module.exports = DotenvWebpackPlugin;
