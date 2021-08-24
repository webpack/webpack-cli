"use strict";

const { runTest } = require("../helpers");

const webpackTest = () => {
  const packageName = "webpack";
  const args = [];
  const logMessage = "It looks like webpack is not installed.";

  return runTest(packageName, args, logMessage);
};

module.exports.run = [webpackTest];
module.exports.name = "Missing webpack";
