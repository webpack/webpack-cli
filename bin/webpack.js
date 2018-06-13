#!/usr/bin/env node

'use strict';
const semver = require('semver');
const version = require('../package.json').engines.node;
const importLocal = require("import-local");

require("v8-compile-cache");

// Prefer the local installation of webpack-cli
if (importLocal(__filename)) {
    return;
}
process.title = "webpack";


if (!semver.satisfies(process.version, version)) {
  const rawVersion = version.replace(/[^\d\.]*/, '');
  console.log(
      'webpack CLI requires at least Node v' + rawVersion + '. ' +
      'You have ' + process.version + '.\n' +
      'See https://webpack.js.org/ ' +
      'for migration help and similar.');
  process.exit(1);
}

require('./run');
