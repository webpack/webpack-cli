"use strict";

const { runTest, runTestStdout } = require("../helpers");

const webpackDevServerTest = () => {
  const packageName = "webpack-dev-server";
  const args = ["serve"];
  const logMessage = "For using 'serve' command you need to install: 'webpack-dev-server' package.";

  return runTest(packageName, args, logMessage);
};

const webpackDevServerWithHelpTest = () => {
  const packageName = "webpack-dev-server";
  const cliArgs = ["help", "serve"];
  // Max 49-char prefix fits in one line.
  // Deleting package's names is safe because CLI appends missing package list automatically.
  const logMessage = "To see all available options you need to install";

  return runTestStdout({ packageName, cliArgs, logMessage });
};

module.exports.name = "Missing webpack-dev-server";
module.exports.run = [webpackDevServerTest, webpackDevServerWithHelpTest];
