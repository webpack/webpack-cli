#!/usr/bin/env node

"use strict";

// `module.enableCompileCache` is only available on Node.js >= 22.8.0
// eslint-disable-next-line n/no-unsupported-features/node-builtins
const { constants, enableCompileCache } = require("node:module");

if (enableCompileCache) {
  try {
    const { status, directory } = enableCompileCache();

    // Minimizer workers and other child processes start without the cache;
    // the variable Node reads at startup hands them the same directory. Only a
    // fresh start returns the base directory, which children tag by version.
    if (
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      status === constants.compileCacheStatus.ENABLED &&
      process.env.NODE_COMPILE_CACHE === undefined
    ) {
      process.env.NODE_COMPILE_CACHE = directory;
    }
  } catch {
    // Ignore errors
  }
}

/**
 * Runs the local installation of `webpack-cli` resolved from the current directory, unless it is
 * this file, the same as `import-local` does.
 * @returns {boolean} whether the local installation was run
 */
const runLocalCLI = () => {
  const path = require("node:path");

  let cwd;

  try {
    cwd = require("node:fs").realpathSync(process.cwd());
  } catch (error) {
    if (error.code !== "ENOENT") {
      return false;
    }

    cwd = path.resolve(process.cwd());
  }

  let localFile;

  try {
    localFile = require("node:module")
      .createRequire(path.join(cwd, "noop.js"))
      .resolve("webpack-cli/bin/cli.js");
  } catch {
    return false;
  }

  const localNodeModules = path.join(process.cwd(), "node_modules");
  const isInLocalNodeModules =
    !path.relative(localNodeModules, __filename).startsWith("..") &&
    // On Windows, `path.relative()` returns the second path when the paths are on different drives
    path.parse(localNodeModules).root === path.parse(__filename).root;

  // `path.relative()` because the case of `__filename` is inconsistent on Windows
  if (isInLocalNodeModules || path.relative(localFile, __filename) === "") {
    return false;
  }

  require(localFile);

  return true;
};

// Prefer the local installation of `webpack-cli` when one exists. Run this
// before requiring the (heavier) CLI implementation: a delegated run then never
// loads it, and `WEBPACK_CLI_SKIP_IMPORT_LOCAL` skips the lookup too.
if (!process.env.WEBPACK_CLI_SKIP_IMPORT_LOCAL && runLocalCLI()) {
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
