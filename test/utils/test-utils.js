'use strict';
const path = require('path');
const fs = require('fs');
const execa = require('execa');
const { sync: spawnSync, node: execaNode } = execa;
const { Writable } = require('readable-stream');
const concat = require('concat-stream');
const { version } = require('webpack');

const WEBPACK_PATH = path.resolve(__dirname, '../../packages/webpack-cli/bin/cli.js');
const ENABLE_LOG_COMPILATION = process.env.ENABLE_PIPE || false;
const isWebpack5 = version.startsWith('5');

/**
 * Run the webpack CLI for a test case.
 *
 * @param {String} testCase The path to folder that contains the webpack.config.js
 * @param {Array} args Array of arguments to pass to webpack
 * @param {Boolean} setOutput Boolean that decides if a default output path will be set or not
 * @returns {Object} The webpack output or Promise when nodeOptions are present
 */
function run(testCase, args = [], setOutput = true, nodeArgs = [], env) {
    const cwd = path.resolve(testCase);

    const outputPath = path.resolve(testCase, 'bin');
    const processExecutor = nodeArgs.length ? execaNode : spawnSync;
    const argsWithOutput = setOutput ? args.concat('--output-path', outputPath) : args;
    const result = processExecutor(WEBPACK_PATH, argsWithOutput, {
        cwd,
        reject: false,
        nodeOptions: nodeArgs,
        env,
        stdio: ENABLE_LOG_COMPILATION ? 'inherit' : 'pipe',
    });

    return result;
}

function runWatch({ testCase, args = [], setOutput = true, outputKillStr = 'Time' }) {
    const cwd = path.resolve(testCase);

    const outputPath = path.resolve(testCase, 'bin');
    const argsWithOutput = setOutput ? args.concat('--output-path', outputPath) : args;

    return new Promise((resolve, reject) => {
        const watchPromise = execa(WEBPACK_PATH, argsWithOutput, {
            cwd,
            reject: false,
            stdio: 'pipe',
        });

        watchPromise.stdout.pipe(
            new Writable({
                write(chunk, encoding, callback) {
                    const output = chunk.toString('utf8');

                    if (output.includes(outputKillStr)) {
                        watchPromise.kill();
                    }

                    callback();
                },
            }),
        );
        watchPromise
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function runAndGetWatchProc(testCase, args = [], setOutput = true, input = '', forcePipe = false) {
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
}
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
        const writeAnswer = () => {
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
                        outputTimeout = setTimeout(writeAnswer, delay);
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

/**
 *
 * @param {String} testCase - testCase directory
 * @param {String} file - file relative to testCase
 * @param {String} data - data to append
 * @returns {undefined}
 * @throws - throw an Error if file does not exist
 */
function appendDataIfFileExists(testCase, file, data) {
    const filePath = path.resolve(testCase, file);
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, data);
    } else {
        throw new Error(`Oops! ${filePath} does not exist!`);
    }
}

/**
 * fs.copyFileSync was added in Added in: v8.5.0
 * We should refactor the below code once our minimal supported version is v8.5.0
 * @param {String} testCase - testCase directory
 * @param {String} file - file relative to testCase which is going to be copied
 * @returns {String} - absolute file path of new file
 * @throws - throw an Error if file copy fails
 */
async function copyFileAsync(testCase, file) {
    const fileToChangePath = path.resolve(testCase, file);
    const fileMetaData = path.parse(file);
    const fileCopyName = fileMetaData.name.concat('_copy').concat(fileMetaData.ext);
    const copyFilePath = path.resolve(testCase, fileCopyName);
    fs.access(fileToChangePath, fs.F_OK, (accessErr) => {
        if (accessErr) throw new Error(`Oops! ${fileToChangePath} does not exist!`);
    });
    const data = fs.readFileSync(fileToChangePath);
    fs.writeFileSync(copyFilePath, data);
    return copyFilePath;
}

/**
 * fs.copyFileSync was added in Added in: v8.5.0
 * We should refactor the below code once our minimal supported version is v8.5.0
 * @param {String} testCase - testCase directory
 * @param {String} file - file relative to testCase which is going to be copied
 * @returns {String} - absolute file path of new file
 * @throws - throw an Error if file copy fails
 */
function copyFile(testCase, file) {
    const fileToChangePath = path.resolve(testCase, file);
    const fileMetaData = path.parse(file);
    const fileCopyName = fileMetaData.name.concat('_copy').concat(fileMetaData.ext);
    const copyFilePath = path.resolve(testCase, fileCopyName);
    if (fs.existsSync(fileToChangePath)) {
        const fileData = fs.readFileSync(fileToChangePath).toString();
        fs.writeFileSync(copyFilePath, fileData);
        return copyFilePath;
    } else {
        throw new Error(`Oops! ${fileToChangePath} does not exist!`);
    }
}

async function runInstall(cwd) {
    await execa('yarn', {
        cwd,
    });
}

const runServe = (args, testPath) => {
    return runWatch({
        testCase: testPath,
        args: ['serve'].concat(args),
        setOutput: false,
        outputKillStr: 'main',
    });
};

const runInfo = (args, testPath) => {
    return run(testPath, ['info'].concat(args), false);
};

const hyphenToUpperCase = (name) => {
    if (!name) {
        return name;
    }
    return name.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
};

module.exports = {
    run,
    runWatch,
    runServe,
    runAndGetWatchProc,
    runPromptWithAnswers,
    appendDataIfFileExists,
    copyFile,
    copyFileAsync,
    runInstall,
    runInfo,
    hyphenToUpperCase,
    isWebpack5,
};
