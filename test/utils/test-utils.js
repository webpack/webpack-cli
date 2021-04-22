/* eslint-disable node/no-unpublished-require */

'use strict';

const os = require('os');
const stripAnsi = require('strip-ansi');
const path = require('path');
const fs = require('fs');
const execa = require('execa');
const internalIp = require('internal-ip');
const { exec } = require('child_process');
const { node: execaNode } = execa;
const { Writable } = require('readable-stream');
const concat = require('concat-stream');
const { cli, version } = require('webpack');
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

    return processExecutor(WEBPACK_PATH, args, {
        cwd: path.resolve(cwd),
        reject: false,
        stdio: ENABLE_LOG_COMPILATION ? 'inherit' : 'pipe',
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

        process.stdout.pipe(
            new Writable({
                write(chunk, encoding, callback) {
                    const output = stripAnsi(chunk.toString('utf8'));

                    if (outputKillStr.test(output)) {
                        processKill(process);
                    }

                    callback();
                },
            }),
        );

        process.stderr.pipe(
            new Writable({
                write(chunk, encoding, callback) {
                    const output = stripAnsi(chunk.toString('utf8'));

                    if (outputKillStr.test(output)) {
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

/**
 * runPromptWithAnswers
 * @param {string} location location of current working directory
 * @param {string[]} args CLI args to pass in
 * @param {string[]} answers answers to be passed to stdout for inquirer question
 */
const runPromptWithAnswers = (location, args, answers) => {
    const process = runAndGetProcess(location, args);

    process.stdin.setDefaultEncoding('utf-8');

    const delay = 2000;
    let outputTimeout;
    let currentAnswer = 0;

    const writeAnswer = (output) => {
        if (!answers) {
            process.stdin.write(output);
            process.kill();

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

    return new Promise((resolve) => {
        const obj = {};

        let stdoutDone = false;
        let stderrDone = false;

        const complete = () => {
            if (outputTimeout) {
                clearTimeout(outputTimeout);
            }

            if (stdoutDone && stderrDone) {
                process.kill('SIGKILL');
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

const normalizeVersions = (output) => {
    return output.replace(
        /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/gi,
        'x.x.x',
    );
};

const normalizeCwd = (output) => {
    return output.replace(/\\/g, '/').replace(new RegExp(process.cwd().replace(/\\/g, '/'), 'g'), '<cwd>');
};

const normalizeError = (output) => {
    return output.replace(/\s+at .+(}|\))/gs, '\n    at stack');
};

const normalizeStdout = (stdout) => {
    if (typeof stdout !== 'string') {
        return stdout;
    }

    if (stdout.length === 0) {
        return stdout;
    }

    let normalizedStdout = stripAnsi(stdout);
    normalizedStdout = normalizeCwd(normalizedStdout);
    normalizedStdout = normalizeVersions(normalizedStdout);
    normalizedStdout = normalizeError(normalizedStdout);

    return normalizedStdout;
};

const normalizeStderr = (stderr) => {
    if (typeof stderr !== 'string') {
        return stderr;
    }

    if (stderr.length === 0) {
        return stderr;
    }

    let normalizedStderr = stripAnsi(stderr);
    normalizedStderr = normalizeCwd(normalizedStderr);
    normalizedStderr = normalizeVersions(normalizedStderr);
    normalizedStderr = normalizeError(normalizedStderr);

    const networkIPv4 = internalIp.v4.sync();

    if (networkIPv4) {
        normalizedStderr = normalizedStderr.replace(new RegExp(networkIPv4, 'g'), '<network-ip-v4>');
    }

    const networkIPv6 = internalIp.v6.sync();

    if (networkIPv6) {
        normalizedStderr = normalizedStderr.replace(new RegExp(networkIPv6, 'g'), '<network-ip-v6>');
    }

    normalizedStderr = normalizedStderr.replace(/:[0-9]+\//g, ':<port>/');

    if (!networkIPv6) {
        // Github Actions doesnt' support IPv6 on ubuntu in some cases
        normalizedStderr = normalizedStderr.split('\n');

        const ipv4MessageIndex = normalizedStderr.findIndex((item) => /On Your Network \(IPv4\)/.test(item));

        if (ipv4MessageIndex !== -1) {
            normalizedStderr.splice(
                ipv4MessageIndex + 1,
                0,
                '<i> [webpack-dev-server] On Your Network (IPv6): http://[<network-ip-v6>]:<port>/',
            );
        }

        normalizedStderr = normalizedStderr.join('\n');
    }

    return normalizedStderr;
};

const getWebpackCliArguments = (startWith) => {
    if (typeof startWith === 'undefined') {
        return cli.getArguments();
    }

    const result = {};

    for (const [name, value] of Object.entries(cli.getArguments())) {
        if (name.startsWith(startWith)) {
            result[name] = value;
        }
    }

    return result;
};

const readFile = (path, options = {}) =>
    new Promise((resolve, reject) => {
        fs.readFile(path, options, (err, stats) => {
            if (err) {
                reject(err);
            }
            resolve(stats);
        });
    });

const readdir = (path) =>
    new Promise((resolve, reject) => {
        fs.readdir(path, (err, stats) => {
            if (err) {
                reject(err);
            }
            resolve(stats);
        });
    });

const uniqueDirectoryForTest = async () => {
    const result = path.resolve(os.tmpdir(), Date.now().toString());

    if (!fs.existsSync(result)) {
        fs.mkdirSync(result);
    }

    return result;
};

module.exports = {
    run,
    runAndGetProcess,
    runWatch,
    runPromptWithAnswers,
    isWebpack5,
    isDevServer4,
    isWindows,
    normalizeStderr,
    normalizeStdout,
    uniqueDirectoryForTest,
    readFile,
    readdir,
    hyphenToUpperCase,
    processKill,
    getWebpackCliArguments,
};
