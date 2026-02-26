#!/usr/bin/env node

"use strict";

const importLocal = require("import-local");
const WebpackCLI = require("../lib/webpack-cli").default;

const runCLI = async (args) => {
  const cli = new WebpackCLI();

  try {
    await cli.run(args);
  } catch (error) {
    cli.logger.error(error);
    process.exit(2);
  }
};

if (
  !process.env.WEBPACK_CLI_SKIP_IMPORT_LOCAL && // Prefer the local installation of `webpack-cli`
  importLocal(__filename)
) {
  return;
}

process.title = "webpack";

// eslint-disable-next-line unicorn/prefer-top-level-await
runCLI(process.argv);
