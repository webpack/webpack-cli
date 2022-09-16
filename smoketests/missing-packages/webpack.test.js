"use strict";

const { runTest, runTestStdout } = require("../helpers");

const noCommand = () => {
  const packageName = "webpack";
  const args = [];
  const logMessage = "For using 'build' command you need to install: 'webpack' package.";

  return runTest(packageName, args, logMessage);
};

const buildCommand = () => {
  const packageName = "webpack";
  const args = ["build"];
  const logMessage = "For using 'build' command you need to install: 'webpack' package.";

  return runTest(packageName, args, logMessage);
};

const watchCommand = () => {
  const packageName = "webpack";
  const args = ["watch"];
  const logMessage = "For using 'watch' command you need to install: 'webpack' package.";

  return runTest(packageName, args, logMessage);
};

const serveCommand = () => {
  const packageName = "webpack";
  const args = ["serve"];
  const logMessage = "For using 'serve' command you need to install: 'webpack' package.";

  return runTest(packageName, args, logMessage);
};

const versionCommand = () => {
  const packageName = "webpack";
  const args = ["version"];
  const logMessage = "System:";

  return runTestStdout({ packageName, cliArgs: args, logMessage });
};

const helpCommand = () => {
  const packageName = "webpack";
  const args = ["help"];
  const logMessage = "The build tool for modern web applications.";

  return runTestStdout({ packageName, cliArgs: args, logMessage });
};

const infoCommand = () => {
  const packageName = "webpack";
  const args = ["info"];
  const logMessage = "System:";

  return runTestStdout({ packageName, cliArgs: args, logMessage });
};

const configtestCommand = () => {
  const packageName = "webpack";
  const args = ["configtest"];
  const logMessage = "For using 'configtest' command you need to install: 'webpack' package.";

  return runTest(packageName, args, logMessage);
};

module.exports.run = [
  noCommand,
  buildCommand,
  watchCommand,
  serveCommand,
  configtestCommand,
  versionCommand,
  infoCommand,
  helpCommand,
];
module.exports.name = "Missing webpack";
