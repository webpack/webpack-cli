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
  const logMessage =
    "To see all available options you need to install 'webpack', 'webpack-dev-server'.";

  return runTestStdout({ packageName, cliArgs, logMessage });
};

module.exports.run = [webpackDevServerTest, webpackDevServerWithHelpTest];
module.exports.name = "Missing webpack-dev-server";
