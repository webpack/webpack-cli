#!/usr/bin/env node

import Module from 'module';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const originalModuleCompile = Module.prototype._compile;

import 'v8-compile-cache';

import importLocal from 'import-local';
import runCLI from '../lib/bootstrap';
import utils from '../lib/utils';

// Prefer the local installation of `webpack-cli`
if (!process.env.WEBPACK_CLI_SKIP_IMPORT_LOCAL) {
    importLocal(__filename);
}

process.title = 'webpack';

if (utils.packageExists('webpack')) {
    runCLI(process.argv, originalModuleCompile);
} else {
    const { promptInstallation, logger, colors } = utils;

    promptInstallation('webpack', () => {
        utils.logger.error(`It looks like ${colors.bold('webpack')} is not installed.`);
    })
        .then(() => {
            logger.success(`${colors.bold('webpack')} was installed successfully.`);

            runCLI(process.argv, originalModuleCompile);
        })
        .catch(() => {
            logger.error(`Action Interrupted, Please try once again or install ${colors.bold('webpack')} manually.`);

            process.exit(2);
        });
}
