#!/usr/bin/env node

import WebpackCLI from "../lib/webpack-cli.js";

process.title = "webpack";

const cli = new WebpackCLI();

try {
  await cli.run(process.argv);
} catch (error) {
  cli.logger.error(error);
  process.exit(2);
}
