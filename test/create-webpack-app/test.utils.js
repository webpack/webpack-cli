"use strict";

const testUtilsPkg = require("../utils/test-utils.js");
const { processKill } = testUtilsPkg;
const path = require("path");
const execa = require("execa");
const { node: execaNode } = execa;
const stripAnsi = require("strip-ansi");
const concat = require("concat-stream");
const { Writable } = require("readable-stream");

const ENABLE_LOG_COMPILATION = process.env.ENABLE_PIPE || false;
const nodeVersion = parseInt(process.version.split(".")[0].replace("v", ""));

function createPathDependentUtils(cli) {
  const CLI_PATH = path.resolve(__dirname, `../../packages/${cli}/bin/cli.js`);

  /**
   * Webpack CLI test runner.
   *
   * @param {string} cwd The path to folder that contains test
   * @param {Array<string>} args Array of arguments
   * @param {Object<string, any>} options Options for tests
   * @returns {Promise}
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
   *
   * @param {string} cwd The path to folder that contains test
   * @param {Array<string>} args Array of arguments
   * @param {Object<string, any>} options Options for tests
   * @returns {Promise}
   */
  const run = async (cwd, args = [], options = {}) => {
    return createProcess(cwd, args, options);
  };

  /**
   * Run the webpack CLI for a test case and get process.
   *
   * @param {string} cwd The path to folder that contains test
   * @param {Array<string>} args Array of arguments
   * @param {Object<string, any>} options Options for tests
   * @returns {Promise}
   */
  const runAndGetProcess = (cwd, args = [], options = {}) => {
    return createProcess(cwd, args, options);
  };

  /**
   * Run the webpack CLI in watch mode for a test case.
   *
   * @param {string} cwd The path to folder that contains test
   * @param {Array<string>} args Array of arguments
   * @param {Object<string, any>} options Options for tests
   * @returns {Object} The webpack output or Promise when nodeOptions are present
   */
  const runWatch = (cwd, args = [], options = {}) => {
    return new Promise((resolve, reject) => {
      const process = createProcess(cwd, args, options);
      const outputKillStr = options.killString || /webpack \d+\.\d+\.\d/;
      const stdoutKillStr = options.stdoutKillStr;
      const stderrKillStr = options.stderrKillStr;

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
  };
  /*
   * runPromptWithAnswers
   * @param {string} location location of current working directory
   * @param {string[]} args CLI args to pass in
   * @param {string[]} answers answers to be passed to stdout for inquirer question
   */
  const runPromptWithAnswers = (location, args, answers) => {
    const process = runAndGetProcess(location, args);

    process.stdin.setDefaultEncoding("utf-8");

    const delay = 2000;
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

          if (output) {
            if (outputTimeout) {
              clearTimeout(outputTimeout);
            }

            // we must receive new stdout, then have 2 seconds
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
