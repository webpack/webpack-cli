"use strict";

const { runTest, runTestWithHelp } = require("../helpers");

const packageName = "generators";
const isSubPackage = true;

const initTest = () => {
  const args = ["init"];
  const logMessage =
    "For using this command you need to install: '@webpack-cli/generators' package";

  return runTest(packageName, args, logMessage, isSubPackage);
};

const initTestWithHelp = () => {
  const args = ["help", "init"];
  const logMessage =
    "For using 'init' command you need to install '@webpack-cli/generators' package";

  return runTestWithHelp(packageName, args, logMessage, isSubPackage);
};

module.exports.run = [initTest, initTestWithHelp];
module.exports.name = "Missing @webpack-cli/generators";
