const GroupHelper = require('../utils/group-helper');

class BasicGroup extends GroupHelper {
    constructor(options) {
        super(options);
        this.WEBPACK_OPTION_FLAGS = ['prod', 'dev', 'watch', 'w', 'prod', 'p', 'interactive', 'i'];
        this.resolveFlags();
    }
    resolveFlags() {
        const { args } = this;

        const old_args = Object.keys(args);
        const newArgs = old_args
            .map(arg => {
                if (arg === 'entry') {
                    const isCJS = args[arg] === null;
                    if (isCJS) {
                        args['dev'] = true;
                        args['prod'] = false;
                    } else {
                        args['prod'] = true;
                        args['dev'] = false;
                    }
                }
                if (arg === 'interactive') {
                    args['interactive'] = true;
                }
                return arg;
            })
            .filter(e => e);

        newArgs.forEach(arg => {
            if (this.WEBPACK_OPTION_FLAGS.includes(arg)) {
                this.opts.outputOptions[arg] = this.resolveWebpackOptions(arg, args[arg]);
            }
            if (arg == 'analyze') {
                const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
                this.opts.options.plugins = [new BundleAnalyzerPlugin()];
            }
            if (arg == 'sourcemap') {
                this.opts.options.devtool = args[arg] || 'eval';
            }
            if (arg == 'entry') {
                if (args[arg] === 'help') {
                    return;
                }
                this.opts.options[arg] = this.resolveFilePath(args[arg], 'index');
            }
        });
        if (this.opts.outputOptions['dev']) {
            this.opts.outputOptions['prod'] = false;
        }
    }

    resolveWebpackOptions(key, val) {
        return val;
    }
    run() {
        return this.opts;
    }
}

module.exports = BasicGroup;
