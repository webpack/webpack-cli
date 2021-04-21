'use strict';

const { runTestStdout } = require('../helpers');
// eslint-disable-next-line node/no-unpublished-require
const rimraf = require('rimraf');
const { resolve } = require('path');

const prettierTest = async () => {
    const packageName = 'prettier';
    const rootPath = resolve(__dirname, './test-assets');
    const cliArgs = ['init', rootPath, '--force'];
    const logMessage = 'Do you like to install prettier to format generated configuration?';
    const status = await runTestStdout({ packageName, cliArgs, logMessage });
    rimraf.sync(rootPath);
    return status;
};

module.exports.run = [prettierTest];
module.exports.name = 'Missing prettier';
