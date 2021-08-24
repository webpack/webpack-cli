"use strict";

const { runTest, runTestWithHelp } = require("../helpers");

const packageName = "info";
const isSubPackage = true;

const infoTest = () => {
  const args = ["info"];
  const logMessage = "For using this command you need to install: '@webpack-cli/info' package";

  return runTest(packageName, args, logMessage, isSubPackage);
};

const infoTestWithHelp = () => {
  const args = ["help", "info"];
  const logMessage = "For using 'info' command you need to install '@webpack-cli/info' package";

  return runTestWithHelp(packageName, args, logMessage, isSubPackage);
};

module.exports.run = [infoTest, infoTestWithHelp];
module.exports.name = "Missing @webpack-cli/info";
