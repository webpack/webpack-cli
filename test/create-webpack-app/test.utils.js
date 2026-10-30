"use strict";

const os = require("node:os");
const path = require("node:path");
const testUtilsPkg = require("../utils/test-utils");

const nodeVersion = Number.parseInt(process.versions.node.split(".")[0], 10);

// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {Record<string, any>} TestOptions */

// The generators install real packages. Skip the requests the tests don't need, so fewer
// requests can fail. `prefer-offline` isn't used: with a stale cache, npm misses new
// versions that other packages already depend on.
const packageManagerEnv = {
  npm_config_audit: "false",
  npm_config_fund: "false",
  npm_config_update_notifier: "false",
  // Yarn 1 breaks its cache when two installs fill it at the same time, as tests in parallel
  // Jest workers do, so each worker gets its own
  YARN_CACHE_FOLDER: path.join(
    os.tmpdir(),
    `webpack-cli-yarn-cache-${process.env.JEST_WORKER_ID || 1}`,
  ),
  // Yarn 1 fails on packages which require a newer Node.js version than the one running tests,
  // the tests check the generated projects and not the engines of the installed packages
  YARN_IGNORE_ENGINES: "true",
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
