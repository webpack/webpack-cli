import { IWebpackCLI } from "./types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebpackCLI = require("./webpack-cli");

const runCLI = async (args: Parameters<IWebpackCLI["run"]>[0]) => {
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
