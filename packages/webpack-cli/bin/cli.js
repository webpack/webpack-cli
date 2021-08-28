#!/usr/bin/env node

"use strict";

const Module = require("module");

const originalModuleCompile = Module.prototype._compile;

require("v8-compile-cache");

const importLocal = require("import-local");
const runCLI = require("../lib/bootstrap");

if (!process.env.WEBPACK_CLI_SKIP_IMPORT_LOCAL) {
  // Prefer the local installation of `webpack-cli`
  if (importLocal(__filename)) {
    return;
  }
}

process.title = "webpack";

runCLI(process.argv, originalModuleCompile);
