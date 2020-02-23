#!/usr/bin/env node

'use strict';
require('v8-compile-cache');
const execa = require('execa');
const importLocal = require('import-local');
const logger = require('../lib/utils/logger');
const parseArgs = require('../lib/utils/parse-args');
const runner = require('../lib/runner');

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    // return;
}
process.title = 'webpack';

const [, , ...rawArgs] = process.argv;
const { cliArgs, nodeArgs } = parseArgs(rawArgs);
const bootstrapPath = require.resolve('../lib/bootstrap');

runner(nodeArgs, cliArgs);
