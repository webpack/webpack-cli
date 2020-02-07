#!/usr/bin/env node

'use strict';

require('v8-compile-cache');

const execa = require('execa');
const importLocal = require('import-local');
// eslint-disable-next-line node/no-unpublished-require
const logger = require('../lib/utils/logger');

// eslint-disable-next-line node/no-unpublished-require
const parseArgs = require('../lib/utils/parse-args');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    // return;
}
process.title = 'webpack';

const updateNotifier = require('update-notifier');
const packageJson = require('../package.json');

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
    logger.error(`webpack CLI requires at least Node v ${rawVersion}.  You have ${process.version}.`);
    logger.error('See https://webpack.js.org/ for migration help and similar.');
    process.exit(1);
}

const [, , ...rawArgs] = process.argv;
const { cliArgs, nodeArgs } = parseArgs(rawArgs);
// eslint-disable-next-line node/no-unpublished-require
const bootstrapPath = require.resolve('../lib/bootstrap');

execa('node', [...nodeArgs, bootstrapPath, ...cliArgs], { stdio: 'inherit' }).catch(e => {
    process.exit(e.exitCode);
});
