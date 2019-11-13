#!/usr/bin/env node

'use strict';

require('v8-compile-cache');

// ! This file does initial checkup of versions and then runs the CLI

// ? If a global and a local version is present of webpack cli, use the local version
const importLocal = require('import-local');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    return;
}
process.title = 'webpack';
// ? Send and update message in terminal if update is available
// * webpack-logger is used the display coloured terminal messages with webpack logo
process.cliLogger = require('webpack-log')({
    name: 'webpack',
});
// * upadate-notifier is used to make those update is available messages in terminal
const updateNotifier = require('update-notifier');
// * importing a .json file reuturns it as a js object
const packageJson = require('./package.json');

const notifier = updateNotifier({
    pkg: packageJson,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 30, // 1 month
});

if (notifier.update) {
    process.cliLogger.info(`Update available: ${notifier.update.latest}`);
}

const semver = require('semver');

const version = packageJson.engines.node;

// ? Check if current version of CLI is compatible with current version of JS
if (!semver.satisfies(process.version, version)) {
    const rawVersion = version.replace(/[^\d\.]*/, '');
    process.cliLogger.error('webpack CLI requires at least Node v' + rawVersion + '. ' + 'You have ' + process.version + '.\n' + 'See https://webpack.js.org/ ' + 'for migration help and similar.');
    process.exit(1);
}

require('./lib/bootstrap');
