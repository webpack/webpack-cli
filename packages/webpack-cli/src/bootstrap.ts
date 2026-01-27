import WebpackCLI from "./webpack-cli.js";

const runCLI = async (args?: Parameters<WebpackCLI["run"]>[0]) => {
  // Create a new instance of the CLI object
  const cli = new WebpackCLI();

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

if (process.env.npm_lifecycle_script === "tsx") runCLI();
