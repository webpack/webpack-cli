"use strict";

const { runTestStdout, runTestStdoutWithInput } = require("../helpers");
// eslint-disable-next-line node/no-unpublished-require
const rimraf = require("rimraf");
const os = require("os");
const { resolve } = require("path");

const prettierTestWithoutForce = async () => {
  const packageName = "prettier";
  const rootPath = resolve(os.tmpdir(), "./test-assets-2");
  const cliArgs = ["init", rootPath];
  const inputs = {
    "Which of the following JS solutions do you want to use?": `\n`,
    "Do you want to use webpack-dev-server?": `n\n`,
    "Do you want to simplify the creation of HTML files for your bundle?": `n\n`,
    "Do you want to add PWA support?": `n\n`,
    "Which of the following CSS solutions do you want to use?": "\n",
    "Do you like to install prettier to format generated configuration?": `n\n`,
    "Pick a package manager": "\n",
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

const prettierTestWithNoAnswer = async () => {
  const packageName = "prettier";
  const rootPath = resolve(os.tmpdir(), "./test-assets-2");
  const cliArgs = ["init", rootPath, "--force"];
  const logMessage =
    "Generated configuration may not be properly formatted as prettier is not installed";
  const status = await runTestStdout({
    packageName,
    cliArgs,
    logMessage,
  });
  rimraf.sync(rootPath);
  return status;
};

module.exports.run = [prettierTestWithoutForce, prettierTestWithNoAnswer];
module.exports.name = "Missing prettier";
