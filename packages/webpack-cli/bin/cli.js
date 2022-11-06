#!/usr/bin/env node

"use strict";

// import importLocal from "import-local";
import runCLI from "../lib/bootstrap";

// if (!process.env.WEBPACK_CLI_SKIP_IMPORT_LOCAL) {
//   // Prefer the local installation of `webpack-cli`
//   if (importLocal(__filename)) {
//     return;
//   }
// }

process.title = "webpack";

runCLI(process.argv);
