const GroupHelper = require('../utils/GroupHelper');
const logger = require('../utils/logger');
const { core, groups } = require('../utils/cli-flags');

class BasicGroup extends GroupHelper {
    constructor(options) {
        super(options);
        this.WEBPACK_OPTION_FLAGS = core
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
    }
    resolveFlags() {
        const { args } = this;
        if (!args) return;
        const { outputOptions, options } = this.opts;
        Object.keys(args).forEach((arg) => {
            if (this.WEBPACK_OPTION_FLAGS.includes(arg)) {
                outputOptions[arg] = args[arg];
            }
            // TODO: to add once webpack bundle analyzer is installed, which is not at the moment
            // if (arg == 'analyze') {
            // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
            // this.opts.options.plugins = [new BundleAnalyzerPlugin()];
            // }
            if (arg === 'devtool') {
                options.devtool = args[arg];
            }
            if (arg === 'name') {
                options.name = args[arg];
            }
            if (arg === 'entry') {
                options[arg] = this.resolveFilePath(args[arg], 'index.js');
                if (options[arg].length === 0) {
                    logger.error('Error: you provided an invalid entry point.');
                }
            }
        });
    }

    run() {
        this.resolveFlags();
        return this.opts;
    }
}

module.exports = BasicGroup;
