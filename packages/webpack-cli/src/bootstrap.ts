import { type IWebpackCLI } from "./types.js";
import WebpackCLI from "./webpack-cli.js";

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

// TODO remove me in the next major release and use `default` export
module.exports = runCLI;

// @ts-expect-error ...
if (process.env.npm_lifecycle_script === "tsx") runCLI();
