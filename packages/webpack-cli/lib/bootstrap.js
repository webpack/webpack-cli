const WebpackCLI = require("./webpack-cli");

const runCLI = async (args, originalModuleCompile) => {
  // Create a new instance of the CLI object
  const cli = new WebpackCLI();

  try {
    cli._originalModuleCompile = originalModuleCompile;

    await cli.run(args);
  } catch (error) {
    cli.logger.error(error);
    process.exit(2);
  }
};

module.exports = runCLI;
