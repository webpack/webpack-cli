const GroupHelper = require('../utils/group-helper');

class BasicGroup extends GroupHelper {
    constructor(options) {
        super(options);
        this.WEBPACK_OPTION_FLAGS = ['prod', 'dev', 'watch', 'w', 'prod', 'p', 'interactive', 'i'];
    }
    resolveFlags() {
        const { args } = this;

        Object.keys(args).forEach(arg => {
            if (this.WEBPACK_OPTION_FLAGS.includes(arg)) {
                this.opts.outputOptions[arg] = args[arg];
            }
            if (arg == 'analyze') {
                const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
                this.opts.options.plugins = [new BundleAnalyzerPlugin()];
            }
            if (arg == 'sourcemap') {
                this.opts.options.devtool = args[arg];
            }
            if (arg == 'entry') {
                args[arg] = args[arg] || '';
                this.opts.options[arg] = this.resolveFilePath(args[arg], 'index');
            }
        });
        if (this.opts.outputOptions['dev']) {
            this.opts.outputOptions['prod'] = false;
        }
    }

    run() {
        this.resolveFlags();
        return this.opts;
    }
}

module.exports = BasicGroup;
