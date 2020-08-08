#!/usr/bin/env node

'use strict';
require('v8-compile-cache');
const importLocal = require('import-local');
const parseNodeArgs = require('../lib/utils/parse-node-args');
const runner = require('../lib/runner');
const { performance } = require('perf_hooks');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    return;
}
process.title = 'webpack';

const [, , ...rawArgs] = process.argv;
const { cliArgs, nodeArgs } = parseNodeArgs(rawArgs);

const x = performance.now();
process.execArgv.push(...nodeArgs);
console.log({ nodeArgs });
// runner(nodeArgs, cliArgs);
require('../lib/bootstrap');
console.log(process);

console.log(performance.now() - x, 'time takes');
