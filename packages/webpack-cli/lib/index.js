"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CLI = require("./webpack-cli");
module.exports = CLI;
// TODO remove after drop `@webpack-cli/migrate`
module.exports.utils = { logger: console };
