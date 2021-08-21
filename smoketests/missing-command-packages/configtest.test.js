"use strict";

const { runTest, runTestWithHelp } = require("../helpers");

const packageName = "configtest";
const isSubPackage = true;

const configTest = () => {
  const args = ["configtest"];
  const logMessage =
    "For using this command you need to install: '@webpack-cli/configtest' package";

  return runTest(packageName, args, logMessage, isSubPackage);
};

const configTestWithHelp = () => {
  const args = ["help", "configtest"];
  const logMessage =
    "For using 'configtest' command you need to install '@webpack-cli/configtest' package";

  return runTestWithHelp(packageName, args, logMessage, isSubPackage);
};

module.exports.run = [configTest, configTestWithHelp];
module.exports.name = "Missing @webpack-cli/configtest";
