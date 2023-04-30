const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const { DefinePlugin } = require("webpack");

class DotenvWebpackPlugin {
  constructor(config = {}) {
    this.config = Object.assign(
      {},
      {
        envFiles: [],
        prefixes: ["process.env.", "import.meta.env."],
      },
      config,
    );
  }

  apply(compiler) {
    const currentDirectory = path.resolve(process.cwd(), "environment");

    const mode = compiler.options.mode || "production";
    // .local file variables will get precedence
    const environmentFiles =
      this.config.envFiles.length > 0
        ? this.config.envFiles
        : [
            `${currentDirectory}/.env`, // loaded in all cases
            `${currentDirectory}/.env.local`, // loaded in all cases, ignored by git
            `${currentDirectory}/.env.${mode}`, // only loaded in specified mode
            `${currentDirectory}/.env.${mode}.local`, // only loaded in specified mode, ignored by git
          ];

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
              for (let index = 0; index < this.config.prefixes.length; index++) {
                const prefix = this.config.prefixes[index];
                envVariables[`${prefix}${key}`] = value;
              }
            }
          }
        } catch (err) {
          this.logger.error(`Could not read ${environmentFile}`);
        }
      }
    });

    // expand environment vars
    envVariables = dotenvExpand({
      parsed: envVariables,
      // don't write to process.env
      ignoreProcessEnv: true,
    }).parsed;

    new DefinePlugin(envVariables).apply(compiler);
  }
}

module.exports = DotenvWebpackPlugin;
