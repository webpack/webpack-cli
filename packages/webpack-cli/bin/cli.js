#!/usr/bin/env node

'use strict';
require('v8-compile-cache');
const importLocal = require('import-local');
const runCLI = require('../lib/bootstrap');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    return;
}
process.title = 'webpack';

const [, , ...rawArgs] = process.argv;

runCLI(rawArgs);
