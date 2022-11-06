import { IWebpackCLI } from "./types";

import WebpackCLI from "./webpack-cli";

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

export default runCLI;
