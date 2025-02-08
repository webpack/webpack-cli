import { type IWebpackCLI } from "./types";
import { EnvLoader } from "./utils/env-loader";

const WebpackCLI = require("./webpack-cli");

const runCLI = async (args: Parameters<IWebpackCLI["run"]>[0]) => {
  // Load environment variables from .env files
  try {
    EnvLoader.loadEnvFiles();
  } catch (error) {
    console.warn("Warning: Error loading environment variables:", error);
  }

  // Create a new instance of the CLI object
  const cli: IWebpackCLI = new WebpackCLI();

  try {
    await cli.run(args);
  } catch (error) {
    cli.logger.error(error);
    process.exit(2);
  }
};

module.exports = runCLI;
