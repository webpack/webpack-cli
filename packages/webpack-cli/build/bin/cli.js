#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = __importDefault(require("module"));
// @ts-ignore
const originalModuleCompile = module_1.default.prototype._compile;
require("v8-compile-cache");
const import_local_1 = __importDefault(require("import-local"));
const bootstrap_1 = __importDefault(require("../lib/bootstrap"));
const utils_1 = __importDefault(require("../lib/utils"));
if (!process.env.WEBPACK_CLI_SKIP_IMPORT_LOCAL) {
    // Prefer the local installation of `webpack-cli`
    import_local_1.default(__filename);
}
process.title = 'webpack';
if (utils_1.default.packageExists('webpack')) {
    bootstrap_1.default(process.argv, originalModuleCompile);
}
else {
    const { promptInstallation, logger, colors } = utils_1.default;
    promptInstallation('webpack', () => {
        utils_1.default.logger.error(`It looks like ${colors.bold('webpack')} is not installed.`);
    })
        .then(() => {
        logger.success(`${colors.bold('webpack')} was installed successfully.`);
        bootstrap_1.default(process.argv, originalModuleCompile);
    })
        .catch(() => {
        logger.error(`Action Interrupted, Please try once again or install ${colors.bold('webpack')} manually.`);
        process.exit(2);
    });
}
