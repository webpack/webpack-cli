const fs = require("fs");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const { DefinePlugin } = require("webpack");

/** @typedef {import("./types").Config} Config */

class DotenvWebpackPlugin {
  /**
   * Dotenv Webpack Plugin
   * @param {Config} config - Configuration options
   */
  constructor(config = {}) {
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
      config,
    );
  }

  /**
   * Webpack apply hook
   * @param {Object} compiler - Webpack compiler
   * @returns {void}
   */
  apply(compiler) {
    const mode = compiler.options.mode || "production";

    // throw error if envFiles is not an array
    if (!Array.isArray(this.options.envFiles)) {
      const logger = compiler.getInfrastructureLogger("DotenvWebpackPlugin");
      logger.error(`envFiles option must be an array, received ${typeof this.options.envFiles}`);
      return;
    }

    // throw error if prefixes is not an array
    if (!Array.isArray(this.options.prefixes)) {
      const logger = compiler.getInfrastructureLogger("DotenvWebpackPlugin");
      logger.error(`prefixes option must be an array, received ${typeof this.options.prefixes}`);
      return;
    }

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
