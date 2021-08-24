"use strict";

const { runTest } = require("../helpers");

const webpackBundleAnalyzerTest = () => {
  const packageName = "webpack-bundle-analyzer";
  const args = ["--analyze"];
  const logMessage = "It looks like webpack-bundle-analyzer is not installed.";

  return runTest(packageName, args, logMessage);
};

module.exports.run = [webpackBundleAnalyzerTest];
module.exports.name = "Missing webpack-bundle-analyzer";
