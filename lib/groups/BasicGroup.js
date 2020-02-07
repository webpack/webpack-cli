const GroupHelper = require('../utils/GroupHelper');
const { core, groups } = require('../utils/cli-flags');

class BasicGroup extends GroupHelper {
    constructor(options) {
        super(options);
        this.WEBPACK_OPTION_FLAGS = core
            .filter(coreFlag => {
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
        Object.keys(args).forEach(arg => {
            if (this.WEBPACK_OPTION_FLAGS.includes(arg)) {
                this.opts.outputOptions[arg] = args[arg];
            }
            // TODO: to add once webpack bundle analyzer is installed, which is not at the moment
            // if (arg == 'analyze') {
            // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
            // this.opts.options.plugins = [new BundleAnalyzerPlugin()];
            // }
            if (arg === 'sourcemap') {
                this.opts.options.devtool = args[arg] || 'eval';
                this.opts.outputOptions.devtool = args[arg];
            }
            if (arg === 'entry') {
                this.opts.options[arg] = this.resolveFilePath(args[arg], 'index.js');
            }
        });
        if (this.opts.outputOptions['dev']) {
            this.opts.outputOptions['prod'] = undefined;
        }
    }

    run() {
        this.resolveFlags();
        return this.opts;
    }
}

module.exports = BasicGroup;
