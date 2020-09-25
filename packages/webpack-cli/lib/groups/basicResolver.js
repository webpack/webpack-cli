const logger = require('../utils/logger');
const { core, groups } = require('../utils/cli-flags');
const { resolveFilePath } = require('../utils/arg-utils');

const WEBPACK_OPTION_FLAGS = core
    .filter((coreFlag) => {
        return coreFlag.group === groups.BASIC_GROUP;
    })
    .reduce((result, flagObject) => {
        result.push(flagObject.name);
        if (flagObject.alias) {
            result.push(flagObject.alias);
        }
        return result;
    }, []);

console.log(WEBPACK_OPTION_FLAGS);

function resolveArgs(args) {
    const finalOptions = {
        options: {},
        outputOptions: {},
    };
    Object.keys(args).forEach((arg) => {
        if (WEBPACK_OPTION_FLAGS.includes(arg)) {
            finalOptions.outputOptions[arg] = args[arg];
        }
        // TODO: to add once webpack bundle analyzer is installed, which is not at the moment
        // if (arg == 'analyze') {
        // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        // this.opts.options.plugins = [new BundleAnalyzerPlugin()];
        // }
        if (arg === 'devtool') {
            finalOptions.options.devtool = args[arg];
        }
        if (arg === 'name') {
            finalOptions.options.name = args[arg];
        }
        if (arg === 'watch') {
            finalOptions.options.watch = true;
        }
        if (arg === 'entry') {
            finalOptions.options[arg] = resolveFilePath(args[arg], 'index.js');
            if (finalOptions.options[arg].length === 0) {
                logger.error('\nError: you provided an invalid entry point.');
            }
        }
    });
    return finalOptions;
}

module.exports = resolveArgs;
