"use strict";

const { runTestStdout, runTestStdoutWithInput } = require("../helpers");
// eslint-disable-next-line node/no-unpublished-require
const rimraf = require("rimraf");
const os = require("os");
const { resolve } = require("path");

const prettierTest = async () => {
  const packageName = "prettier";
  const rootPath = resolve(os.tmpdir(), "./test-assets");
  const cliArgs = ["init", rootPath, "--force"];
  const logMessage = "Do you like to install prettier to format generated configuration?";
  const status = await runTestStdout({ packageName, cliArgs, logMessage });
  rimraf.sync(rootPath);
  return status;
};

const prettierTestWithNoAnswer = async () => {
  const packageName = "prettier";
  const rootPath = resolve(os.tmpdir(), "./test-assets-2");
  const cliArgs = ["init", rootPath, "--force"];
  const inputs = {
    "Do you like to install prettier to format generated configuration?": "n\n",
  };
  const logMessage =
    "Generated configuration may not be properly formatted as prettier is not installed";
  const status = await runTestStdoutWithInput({
    packageName,
    cliArgs,
    inputs,
    logMessage,
  });
  rimraf.sync(rootPath);
  return status;
};

module.exports.run = [prettierTest, prettierTestWithNoAnswer];
module.exports.name = "Missing prettier";
