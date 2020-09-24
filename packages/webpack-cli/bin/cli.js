#!/usr/bin/env node

'use strict';
require('v8-compile-cache');
const importLocal = require('import-local');
const runCLI = require('../lib/bootstrap');
const { yellow } = require('colorette');
const { packageExists, promptInstallation } = require('@webpack-cli/package-utils');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    return;
}
process.title = 'webpack';

if (packageExists('webpack')) {
    const [, , ...rawArgs] = process.argv;
    runCLI(rawArgs);
} else {
    promptInstallation('webpack', () => {
        console.error(`It looks like ${yellow('webpack')} is not installed.`);
    });
    return;
}
