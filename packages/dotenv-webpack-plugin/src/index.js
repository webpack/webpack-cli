const fs = require("fs");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const { DefinePlugin } = require("webpack");

class DotenvWebpackPlugin {
  constructor(config = {}) {
    const currentDirectory = process.cwd();

    this.config = Object.assign(
      {},
      {
        envFiles: [
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

  apply(compiler) {
    const mode = compiler.options.mode || "production";

    // .local file variables will get precedence
    let environmentFiles = Array.isArray(this.config.envFiles)
      ? this.config.envFiles
      : [this.config.envFiles];

    environmentFiles = environmentFiles.map((environmentFile) =>
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
    envVariables = dotenvExpand.expand({
      parsed: envVariables,
      // don't write to process.env
      ignoreProcessEnv: true,
    }).parsed;

    new DefinePlugin(envVariables).apply(compiler);
  }
}

module.exports = DotenvWebpackPlugin;
