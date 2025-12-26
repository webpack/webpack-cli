"use strict";

const path = require("node:path");
const testUtilsPkg = require("../utils/test-utils");

const nodeVersion = Number.parseInt(process.versions.node.split(".")[0], 10);

// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {Record<string, any>} TestOptions */

function createPathDependentUtils(cli) {
  const CLI_PATH = path.resolve(__dirname, `../../packages/${cli}/bin/cli.js`);

  /**
   * Run the webpack CLI for a test case.
   * @param {string} cwd The path to folder that contains test
   * @param {Array<string>} args Array of arguments
   * @param {TestOptions} options Options for tests
   * @returns {Promise<import("execa").Result>} child process
   */
  const run = async (cwd, args = [], options = {}) =>
    testUtilsPkg.run(cwd, args, {
      ...options,
      executorPath: CLI_PATH,
    });

  /**
   * Run the webpack CLI in watch mode for a test case.
   * @param {string} cwd The path to folder that contains test
   * @param {Array<string>} args Array of arguments
   * @param {TestOptions} options Options for tests
   * @returns {Promise<import("execa").Result>} The webpack output or Promise when nodeOptions are present
   */
  const runWatch = async (cwd, args = [], options = {}) =>
    testUtilsPkg.runWatch(cwd, args, {
      ...options,
      executorPath: CLI_PATH,
    });

  /**
   * runPromptWithAnswers
   * @param {string} cwd The path to folder that contains test
   * @param {string[]} args CLI args to pass in
   * @param {string[]} answers answers to be passed to stdout for inquirer question
   * @param {TestOptions} options Options for tests
   * @returns {Promise<{ stdout: string, stderr: string }>} result
   */
  const runPromptWithAnswers = async (cwd, args, answers = [], options = {}) =>
    testUtilsPkg.runPromptWithAnswers(cwd, args, answers, {
      ...options,
      executorPath: CLI_PATH,
    });

  return { run, runWatch, runPromptWithAnswers };
}

module.exports = {
  createPathDependentUtils,
  nodeVersion,
  ...testUtilsPkg,
};
