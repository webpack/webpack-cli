const fs = require("fs");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const { DefinePlugin } = require("webpack");
const { validate } = require("schema-utils");
const schema = require("./options.json");

/** @typedef {import("./types").Config} Config */
/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */

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

    this.options = Object.assign(
      {},
      {
        envFiles: [
          `${currentDirectory}/.env.example`, // loaded in all cases
          `${currentDirectory}/.env`, // loaded in all cases
          `${currentDirectory}/.env.local`, // loaded in all cases, ignored by git
          `${currentDirectory}/.env.[mode]`, // only loaded in specified mode
          `${currentDirectory}/.env.[mode].local`, // only loaded in specified mode, ignored by git
        ],
        prefixes: ["process.env.", "import.meta.env."],
      },
      options,
    );
  }

  /**
   * Webpack apply hook
   * @param {Object} compiler - Webpack compiler
   * @returns {void}
   */
  apply(compiler) {
    const mode = compiler.options.mode || "production";

    const environmentFiles = this.options.envFiles.map((environmentFile) =>
      environmentFile.replace(/\[mode\]/g, mode),
    );

    let envVariables = {};
    // parse environment vars from .env files
    environmentFiles.forEach((environmentFile) => {
      if (fs.existsSync(environmentFile)) {
        try {
          const environmentFileContents = fs.readFileSync(environmentFile);
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
        } catch (err) {
          const logger = compiler.getInfrastructureLogger("DotenvWebpackPlugin");
          logger.error(`Could not read ${environmentFile}`);
        }
      }
    });

    // expand environment vars
    envVariables = dotenvExpand.expand({
      parsed: envVariables,
      // don't write to process.env
      ignoreProcessEnv: true,
    }).parsed;

    new DefinePlugin(envVariables).apply(compiler);
  }
}

module.exports = DotenvWebpackPlugin;
