'use strict';
const path = require('path');
const fs = require('fs');
const execa = require('execa');
const { sync: spawnSync } = execa;
const { Writable } = require('readable-stream');
const WEBPACK_PATH = path.resolve(__dirname, '../../packages/webpack-cli/bin/cli.js');
const ENABLE_LOG_COMPILATION = process.env.ENABLE_PIPE || false;
/**
 * Description
 *
 * @param {*} testCase The path to folder that contains the webpack.config.js
 * @param {*} args Array of arguments to pass to webpack
 * @param {*} setOutput Boolean that decides if a default output path will be set or not
 * @returns {Object} The webpack output
 */
function run(testCase, args = [], setOutput = true) {
    const cwd = path.resolve(testCase);

    const outputPath = path.resolve(testCase, 'bin');
    const argsWithOutput = setOutput ? args.concat('--output', outputPath) : args;
    const result = spawnSync(WEBPACK_PATH, argsWithOutput, {
        cwd,
        reject: false,
        stdio: ENABLE_LOG_COMPILATION ? 'inherit' : 'pipe',
    });
    return result;
}

function runWatch({ testCase, args = [], setOutput = true, outputKillStr = 'Time' }) {
    const cwd = path.resolve(testCase);

    const outputPath = path.resolve(testCase, 'bin');
    const argsWithOutput = setOutput ? args.concat('--output', outputPath) : args;

    return new Promise(resolve => {
        const watchPromise = execa(WEBPACK_PATH, argsWithOutput, {
            cwd,
            reject: false,
            stdio: ENABLE_LOG_COMPILATION ? 'inherit' : 'pipe',
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
        watchPromise.then(result => {
            resolve(result);
        });
    });
}

function runAndGetWatchProc(testCase, args = [], setOutput = true) {
    const cwd = path.resolve(testCase);

    const outputPath = path.resolve(testCase, 'bin');
    const argsWithOutput = setOutput ? args.concat('--output', outputPath) : args;

    const webpackProc = execa(WEBPACK_PATH, argsWithOutput, {
        cwd,
        reject: false,
        stdio: ENABLE_LOG_COMPILATION ? 'inherit' : 'pipe',
    });

    return webpackProc;
}

function extractSummary(stdout) {
    if (stdout === '') {
        return '';
    }
    const metaData = ['Output Directory', 'Built', 'Version', 'Compile Time'];

    const summaryArray = stdout
        .split('\n')
        .filter(line => metaData.find(category => line.includes(category)))
        .filter(line => line)
        .map(line => line.trim())
        .map(line => {
            const categoryTouple = line.split(':');
            const categoryIdentifier = categoryTouple.shift();
            const categoryValue = categoryTouple.pop();
            return {
                [categoryIdentifier]: categoryValue,
            };
        });
    const summaryObject = summaryArray.reduce((acc, curr) => ({ ...curr, ...acc }));
    return summaryObject;
}

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
 *
 * @param {String} testCase - testCase directory
 * @param {String} file - file relative to testCase
 * @param {String} data - data to append
 * @param {String} cbFile - second file to write to
 * @param {String} cbData - second data to write
 * @returns {undefined}
 * @throws - throw an Error if file does not exist
 */
function appendDataToMultipleIfFilesExists(testCase, file, data, cbFile, cbData) {
    const filePath = path.resolve(testCase, file);
    fs.access(filePath, fs.F_OK, accessErr => {
        if (accessErr) throw new Error(`Oops! ${accessErr} does not exist!`);
        fs.appendFile(filePath, data, 'utf8', () => {
            const cbFilePath = path.resolve(testCase, cbFile);
            fs.appendFile(cbFilePath, cbData, () => {});
        });
    });
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
    fs.access(fileToChangePath, fs.F_OK, accessErr => {
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

module.exports = {
    run,
    runWatch,
    runAndGetWatchProc,
    extractSummary,
    appendDataIfFileExists,
    copyFile,
    copyFileAsync,
    appendDataToMultipleIfFilesExists,
    runInstall,
};
