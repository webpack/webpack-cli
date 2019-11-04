#!/usr/bin/env node
'use strict';

require('v8-compile-cache');
const logger = require('./lib/utils/logger');

const importLocal = require('import-local');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    // @ts-ignore
    return;
}
process.title = 'webpack';

const packageJson = require('./package.json');

const semver = require('semver');

const version = packageJson.engines.node;

if (!semver.satisfies(process.version, version)) {
    const rawVersion = version.replace(/[^\d\.]*/, '');
    logger.error('webpack CLI requires at least Node v' + rawVersion + '. ' + 'You have ' + process.version + '.\n' + 'See https://webpack.js.org/ ' + 'for migration help and similar.');
    process.exit(1);
}

require('./lib/bootstrap');
