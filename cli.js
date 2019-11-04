#!/usr/bin/env node
'use strict';

require('v8-compile-cache');
const logger = require('./lib/utils/logger');

const importLocal = require('import-local');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    return;
}
process.title = 'webpack';

const updateNotifier = require('update-notifier');
const packageJson = require('./package.json');

const notifier = updateNotifier({
    pkg: packageJson,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 30, // 1 month
});

if (notifier.update) {
    logger.info(`Update available: ${notifier.update.latest}`);
}
const semver = require('semver');

const version = packageJson.engines.node;

if (!semver.satisfies(process.version, version)) {
    const rawVersion = version.replace(/[^\d\.]*/, '');
    logger.error('webpack CLI requires at least Node v' + rawVersion + '. ' + 'You have ' + process.version + '.\n' + 'See https://webpack.js.org/ ' + 'for migration help and similar.');
    process.exit(1);
}

require('./lib/bootstrap');
