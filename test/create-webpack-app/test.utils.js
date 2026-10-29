"use strict";

const path = require("node:path");
const testUtilsPkg = require("../utils/test-utils");

const nodeVersion = Number.parseInt(process.versions.node.split(".")[0], 10);

// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {Record<string, any>} TestOptions */

// The generators install real packages. Let npm reuse what is in its cache instead of
// asking the registry about every package again, and retry the requests it does make
// more times, so a network error doesn't fail the test.
const packageManagerEnv = {
  npm_config_prefer_offline: "true",
  npm_config_fetch_retries: "5",
  npm_config_audit: "false",
  npm_config_fund: "false",
  npm_config_update_notifier: "false",
};

/**
 * Fail with the package manager's error, rather than with the output the test misses.
 * @template {{ stderr: string }} T
 * @param {T} result result of a CLI run
 * @returns {T} the same result
 */
const checkInstall = (result) => {
  if (result.stderr && result.stderr.includes("Error occurred while installing packages")) {
    throw new Error(`Installing packages failed:\n${result.stderr}`);
  }

  return result;
};

function createPathDependentUtils(cli) {
  const CLI_PATH = path.resolve(__dirname, `../../packages/${cli}/bin/cli.js`);

  /**
   * Run the webpack CLI for a test case.
   * @param {string} cwd The path to folder that contains test
   * @param {string[]} args Array of arguments
   * @param {TestOptions} options Options for tests
   * @returns {Promise<import("execa").Result>} child process
   */
  const run = async (cwd, args = [], options = {}) =>
    checkInstall(
      await testUtilsPkg.run(cwd, args, {
        ...options,
        env: { ...packageManagerEnv, ...options.env },
        executorPath: CLI_PATH,
      }),
    );

  /**
   * Run the webpack CLI in watch mode for a test case.
   * @param {string} cwd The path to folder that contains test
   * @param {string[]} args Array of arguments
   * @param {TestOptions} options Options for tests
   * @returns {Promise<import("execa").Result>} The webpack output or Promise when nodeOptions are present
   */
  const runWatch = async (cwd, args = [], options = {}) =>
    testUtilsPkg.runWatch(cwd, args, {
      ...options,
      env: { ...packageManagerEnv, ...options.env },
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
    checkInstall(
      await testUtilsPkg.runPromptWithAnswers(cwd, args, answers, {
        ...options,
        env: { ...packageManagerEnv, ...options.env },
        executorPath: CLI_PATH,
      }),
    );

  return { run, runWatch, runPromptWithAnswers };
}

module.exports = {
  createPathDependentUtils,
  nodeVersion,
  ...testUtilsPkg,
};
