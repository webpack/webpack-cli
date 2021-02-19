/* eslint-disable node/no-unpublished-require */

'use strict';

const stripAnsi = require('strip-ansi');
const path = require('path');
const execa = require('execa');
const { exec } = require('child_process');
const { node: execaNode } = execa;
const { Writable } = require('readable-stream');
const concat = require('concat-stream');
const { version } = require('webpack');
const isWebpack5 = version.startsWith('5');

let devServerVersion;

try {
    devServerVersion = require('webpack-dev-server/package.json').version;
} catch (error) {
    // Nothing
}

const isDevServer4 = devServerVersion && devServerVersion.startsWith('4');

const WEBPACK_PATH = path.resolve(__dirname, '../../packages/webpack-cli/bin/cli.js');
const ENABLE_LOG_COMPILATION = process.env.ENABLE_PIPE || false;
const isWindows = process.platform === 'win32';

const hyphenToUpperCase = (name) => {
    if (!name) {
        return name;
    }
    return name.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
};

const processKill = (process) => {
    if (isWindows) {
        exec('taskkill /pid ' + process.pid + ' /T /F');
    } else {
        process.kill();
    }
};

/**
 * Run the webpack CLI for a test case.
 *
 * @param {String} testCase The path to folder that contains the webpack.config.js
 * @param {Array} args Array of arguments to pass to webpack
 * @param {Object<string, any>} options Boolean that decides if a default output path will be set or not
 * @returns {Promise}
 */
const run = async (testCase, args = [], options = {}) => {
    const cwd = path.resolve(testCase);
    const { nodeOptions = [] } = options;
    const processExecutor = nodeOptions.length ? execaNode : execa;

    return processExecutor(WEBPACK_PATH, args, {
        cwd,
        reject: false,
        stdio: ENABLE_LOG_COMPILATION ? 'inherit' : 'pipe',
        maxBuffer: Infinity,
        ...options,
    });
};

/**
 * Run the webpack CLI in watch mode for a test case.
 *
 * @param {String} testCase The path to folder that contains the webpack.config.js
 * @param {Array} args Array of arguments to pass to webpack
 * @param {Object<string, any>} options Boolean that decides if a default output path will be set or not
 * @param {string} outputKillStr String to kill
 * @returns {Object} The webpack output or Promise when nodeOptions are present
 */
const runWatch = (testCase, args = [], options, outputKillStr = /webpack \d+\.\d+\.\d/) => {
    const cwd = path.resolve(testCase);

    return new Promise((resolve, reject) => {
        const proc = execa(WEBPACK_PATH, args, {
            cwd,
            reject: false,
            stdio: 'pipe',
            ...options,
        });

        proc.stdout.pipe(
            new Writable({
                write(chunk, encoding, callback) {
                    const output = chunk.toString('utf8');

                    if (outputKillStr.test(output)) {
                        processKill(proc);
                    }

                    callback();
                },
            }),
        );

        proc.then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
};

const runAndGetWatchProc = (testCase, args = [], setOutput = true, input = '', forcePipe = false) => {
    const cwd = path.resolve(testCase);

    const outputPath = path.resolve(testCase, 'bin');
    const argsWithOutput = setOutput ? args.concat('--output-path', outputPath) : args;

    const options = {
        cwd,
        reject: false,
        stdio: ENABLE_LOG_COMPILATION && !forcePipe ? 'inherit' : 'pipe',
    };

    // some tests don't work if the input option is an empty string
    if (input) {
        options.input = input;
    }

    const webpackProc = execa(WEBPACK_PATH, argsWithOutput, options);

    return webpackProc;
};
/**
 * runPromptWithAnswers
 * @param {string} location location of current working directory
 * @param {string[]} args CLI args to pass in
 * @param {string[]} answers answers to be passed to stdout for inquirer question
 * @param {boolean} waitForOutput whether to wait for stdout before writing the next answer
 */
const runPromptWithAnswers = (location, args, answers, waitForOutput = true) => {
    const runner = runAndGetWatchProc(location, args, false, '', true);

    runner.stdin.setDefaultEncoding('utf-8');

    const delay = 2000;
    let outputTimeout;

    if (waitForOutput) {
        let currentAnswer = 0;
        const writeAnswer = (output) => {
            if (!answers) {
                runner.stdin.write(output);
                runner.kill();
                return;
            }

            if (currentAnswer < answers.length) {
                runner.stdin.write(answers[currentAnswer]);
                currentAnswer++;
            }
        };

        runner.stdout.pipe(
            new Writable({
                write(chunk, encoding, callback) {
                    const output = chunk.toString('utf8');
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
    } else {
        // Simulate answers by sending the answers every 2s
        answers.reduce((prevAnswer, answer) => {
            return prevAnswer.then(() => {
                return new Promise((resolvePromise) => {
                    setTimeout(() => {
                        runner.stdin.write(answer);
                        resolvePromise();
                    }, delay);
                });
            });
        }, Promise.resolve());
    }

    return new Promise((resolve) => {
        const obj = {};
        let stdoutDone = false;
        let stderrDone = false;
        const complete = () => {
            if (outputTimeout) {
                clearTimeout(outputTimeout);
            }
            if (stdoutDone && stderrDone) {
                runner.kill('SIGKILL');
                resolve(obj);
            }
        };

        runner.stdout.pipe(
            concat((result) => {
                stdoutDone = true;
                obj.stdout = result.toString();
                complete();
            }),
        );

        runner.stderr.pipe(
            concat((result) => {
                stderrDone = true;
                obj.stderr = result.toString();
                complete();
            }),
        );
    });
};

module.exports = {
    run,
    runWatch,
    runAndGetWatchProc,
    runPromptWithAnswers,
    isWebpack5,
    isDevServer4,
    isWindows,
    processKill,
    hyphenToUpperCase
};
