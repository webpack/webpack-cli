"use strict";

const path = require("node:path");
const concat = require("concat-stream");
const execa = require("execa");
const { Writable } = require("readable-stream");
const stripAnsi = require("strip-ansi");
const testUtilsPkg = require("../utils/test-utils");

const { node: execaNode } = execa;
const { processKill } = testUtilsPkg;

const ENABLE_LOG_COMPILATION = process.env.ENABLE_PIPE || false;
const nodeVersion = Number.parseInt(process.versions.node.split(".")[0], 10);

// eslint-disable-next-line jsdoc/no-restricted-syntax
/** @typedef {Record<string, any>} TestOptions */

function createPathDependentUtils(cli) {
  const CLI_PATH = path.resolve(__dirname, `../../packages/${cli}/bin/cli.js`);

  /**
   * Webpack CLI test runner.
   * @param {string} cwd The path to folder that contains test
   * @param {Array<string>} args Array of arguments
   * @param {TestOptions} options Options for tests
   * @returns {Promise<import("execa").ExecaChildProcess>} child process
   */
  const createProcess = (cwd, args, options) => {
    const { nodeOptions = [] } = options;
    const processExecutor = nodeOptions.length ? execaNode : execa;

    return processExecutor(CLI_PATH, args, {
      cwd: path.resolve(cwd),
      reject: false,
      stdio: ENABLE_LOG_COMPILATION ? "inherit" : "pipe",
      maxBuffer: Infinity,
      env: { WEBPACK_CLI_HELP_WIDTH: 1024 },
      ...options,
    });
  };

  /**
   * Run the webpack CLI for a test case.
   * @param {string} cwd The path to folder that contains test
   * @param {Array<string>} args Array of arguments
   * @param {TestOptions} options Options for tests
   * @returns {Promise<import("execa").ExecaChildProcess>} child process
   */
  const run = async (cwd, args = [], options = {}) => createProcess(cwd, args, options);

  /**
   * Run the webpack CLI for a test case and get process.
   * @param {string} cwd The path to folder that contains test
   * @param {Array<string>} args Array of arguments
   * @param {TestOptions} options Options for tests
   * @returns {Promise<import("execa").ExecaChildProcess>} child process
   */
  const runAndGetProcess = (cwd, args = [], options = {}) => createProcess(cwd, args, options);

  /**
   * Run the webpack CLI in watch mode for a test case.
   * @param {string} cwd The path to folder that contains test
   * @param {Array<string>} args Array of arguments
   * @param {TestOptions} options Options for tests
   * @returns {Promise<TestOptions>} The webpack output or Promise when nodeOptions are present
   */
  const runWatch = (cwd, args = [], options = {}) =>
    new Promise((resolve, reject) => {
      const process = createProcess(cwd, args, options);
      const outputKillStr = options.killString || /webpack \d+\.\d+\.\d/;
      const { stdoutKillStr } = options;
      const { stderrKillStr } = options;

      let isStdoutDone = false;
      let isStderrDone = false;

      process.stdout.pipe(
        new Writable({
          write(chunk, encoding, callback) {
            const output = stripAnsi(chunk.toString("utf8"));

            if (stdoutKillStr && stdoutKillStr.test(output)) {
              isStdoutDone = true;
            } else if (!stdoutKillStr && outputKillStr.test(output)) {
              processKill(process);
            }

            if (isStdoutDone && isStderrDone) {
              processKill(process);
            }

            callback();
          },
        }),
      );

      process.stderr.pipe(
        new Writable({
          write(chunk, encoding, callback) {
            const output = stripAnsi(chunk.toString("utf8"));

            if (stderrKillStr && stderrKillStr.test(output)) {
              isStderrDone = true;
            } else if (!stderrKillStr && outputKillStr.test(output)) {
              processKill(process);
            }

            if (isStdoutDone && isStderrDone) {
              processKill(process);
            }

            callback();
          },
        }),
      );

      process
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

  /**
   * runPromptWithAnswers
   * @param {string} location of current working directory
   * @param {string[]} args CLI args to pass in
   * @param {string[]} answers to be passed to stdout for inquirer question
   * @returns {Promise<{ stdout: string, stderr: string }>} result
   */
  const runPromptWithAnswers = (location, args, answers) => {
    const process = runAndGetProcess(location, args);

    process.stdin.setDefaultEncoding("utf8");

    const delay = 1000;
    let outputTimeout;
    let currentAnswer = 0;

    const writeAnswer = (output) => {
      if (!answers) {
        process.stdin.write(output);
        processKill(process);

        return;
      }

      if (currentAnswer < answers.length) {
        process.stdin.write(answers[currentAnswer]);
        currentAnswer++;
      }
    };

    process.stdout.pipe(
      new Writable({
        write(chunk, encoding, callback) {
          const output = chunk.toString("utf8");

          if (output.length > 0) {
            if (outputTimeout) {
              clearTimeout(outputTimeout);
            }

            // we must receive new stdout, then have 1 second
            // without any stdout before writing the next answer
            outputTimeout = setTimeout(() => {
              writeAnswer(output);
            }, delay);
          }

          callback();
        },
      }),
    );

    return new Promise((resolve) => {
      const obj = {};

      let stdoutDone = false;
      let stderrDone = false;

      const complete = () => {
        if (outputTimeout) {
          clearTimeout(outputTimeout);
        }

        if (stdoutDone && stderrDone) {
          processKill(process);
          resolve(obj);
        }
      };

      process.stdout.pipe(
        concat((result) => {
          stdoutDone = true;
          obj.stdout = result.toString();

          complete();
        }),
      );

      process.stderr.pipe(
        concat((result) => {
          stderrDone = true;
          obj.stderr = result.toString();

          complete();
        }),
      );
    });
  };

  return { runAndGetProcess, run, runWatch, runPromptWithAnswers };
}

module.exports = {
  createPathDependentUtils,
  nodeVersion,
  ...testUtilsPkg,
};
