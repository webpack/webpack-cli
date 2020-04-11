const GroupHelper = require('../utils/GroupHelper');
const { core, groups } = require('../utils/cli-flags');

class CoreGroup {
    constructor(options) {
        this.opts = {
            outputOptions: {},
            options: {},
            processingMessageBuffer: [],
        };
    }
    resolveFlags() {
        console.log(this);
        const { args } = this;
        if (!args) return;
        const { outputOptions, options } = this.opts;
        Object.keys(args).forEach(arg => {
            if (this.WEBPACK_OPTION_FLAGS.includes(arg)) {
                outputOptions[arg] = args[arg];
            }
            // TODO: to add once webpack bundle analyzer is installed, which is not at the moment
            // if (arg == 'analyze') {
            // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
            // this.opts.options.plugins = [new BundleAnalyzerPlugin()];
            // }
            if (arg === 'sourcemap') {
                options.devtool = args[arg] || 'eval';
                outputOptions.devtool = args[arg];
            }
            if (arg === 'entry') {
                options[arg] = this.resolveFilePath(args[arg], 'index.js');
            }
        });
        if (outputOptions['dev']) {
            outputOptions['prod'] = undefined;
        }
    }

    run() {
        this.resolveFlags();
        // console.log(this);
        return this.opts;
    }
}

module.exports = BasicGroup;
