'use strict';

const { runTest } = require('../helpers');

const webpackDevServerTest = () => {
    const packageName = 'webpack-dev-server';
    const args = ['serve'];
    const logMessage = "For using 'serve' command you need to install: 'webpack-dev-server' package";

    return runTest(packageName, args, logMessage);
};

module.exports.run = [webpackDevServerTest];
module.exports.name = 'Missing webpack-dev-server';
