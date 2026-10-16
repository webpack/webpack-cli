#!/usr/bin/env node

"use strict";

// `module.enableCompileCache` is only available on Node.js >= 22.8.0
// eslint-disable-next-line n/no-unsupported-features/node-builtins
const { enableCompileCache } = require("node:module");

if (enableCompileCache) {
  try {
    const { directory } = enableCompileCache();

    // Minimizer workers and other child processes start without the cache;
    // the variable Node reads at startup hands them the same directory.
    if (directory && process.env.NODE_COMPILE_CACHE === undefined) {
      process.env.NODE_COMPILE_CACHE = directory;
    }
  } catch {
    // Ignore errors
  }
}

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
