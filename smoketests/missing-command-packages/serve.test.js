"use strict";

const { runTest, runTestWithHelp } = require("../helpers");

const packageName = "serve";
const isSubPackage = true;

const serveTest = () => {
  const args = ["serve"];
  const logMessage = "For using this command you need to install: '@webpack-cli/serve' package";

  return runTest(packageName, args, logMessage, isSubPackage);
};

const serveTestWithHelp = () => {
  const args = ["help", "serve"];
  const logMessage = "For using 'serve' command you need to install '@webpack-cli/serve' package";

  return runTestWithHelp(packageName, args, logMessage, isSubPackage);
};

module.exports.run = [serveTest, serveTestWithHelp];
module.exports.name = "Missing @webpack-cli/serve";
