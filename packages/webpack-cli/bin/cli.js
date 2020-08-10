#!/usr/bin/env node

'use strict';
require('v8-compile-cache');
const importLocal = require('import-local');
const parseNodeArgs = require('../lib/utils/parse-node-args');
const runCLI = require('../lib/bootstrap');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    return;
}
process.title = 'webpack';

const [, , ...rawArgs] = process.argv;

// figure out how to inject node args at runtime
// eslint-disable-next-line no-unused-vars
const { cliArgs, nodeArgs } = parseNodeArgs(rawArgs);

runCLI(cliArgs);
