#!/usr/bin/env node
'use strict';

require('v8-compile-cache');

const importLocal = require('import-local');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    return;
}
process.title = 'webpack';

const updateNotifier = require('update-notifier');
const packageJson = require('./package.json');

updateNotifier({ pkg: packageJson }).notify();

const semver = require('semver');

const version = packageJson.engines.node;

if (!semver.satisfies(process.version, version)) {
    const rawVersion = version.replace(/[^\d\.]*/, '');
    process.cliLogger.error('webpack CLI requires at least Node v' + rawVersion + '. ' + 'You have ' + process.version + '.\n' + 'See https://webpack.js.org/ ' + 'for migration help and similar.');
    process.exit(1);
}

require('./lib/bootstrap');
