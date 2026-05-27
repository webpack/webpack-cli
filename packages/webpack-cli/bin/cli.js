#!/usr/bin/env node

"use strict";

// Prefer the local installation of `webpack-cli` when one exists. Run this
// before requiring the (heavier) CLI implementation: a delegated run then never
// loads it, and `WEBPACK_CLI_SKIP_IMPORT_LOCAL` skips loading `import-local` too.
if (!process.env.WEBPACK_CLI_SKIP_IMPORT_LOCAL && require("import-local")(__filename)) {
  return;
}

process.title = "webpack";

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

// eslint-disable-next-line unicorn/prefer-top-level-await
runCLI(process.argv);
