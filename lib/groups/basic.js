const GroupHelper = require("../utils/group-helper");

class BasicGroup extends GroupHelper {
    constructor(options) {
        super(options);
        this.WEBPACK_OPTION_FLAGS = ['prod', 'dev', 'watch', 'w', 'prod', 'p', 'interactive', 'i', 'defaults', 'progress'];
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
                this.opts.options.devtool = args[arg] || 'eval';
                this.opts.outputOptions.devtool = args[arg];
            }
            if (arg == 'entry') {
                this.opts.options[arg] = this.resolveFilePath(args[arg], 'index.js');
            }
        });
        if (this.opts.outputOptions['dev']) {
            this.opts.outputOptions['prod'] = undefined;
        }
    }

		newArgs.forEach( arg => {
			if(this.WEBPACK_OPTION_FLAGS.includes(arg)) {
				this.opts.outputOptions[arg] = this.resolveWebpackOptions(arg, args[arg]);
			}
			if(arg == 'sourcemap') {
				this.opts.options.devtool = args[arg] || 'eval';
			}
			if(arg == 'entry') {
				this.opts.options[arg] = this.resolveFilePath(args[arg], 'index');
			}
		})
		// 0CJS: Always default to prod
		if(this.opts.outputOptions['dev']) {
			this.opts.outputOptions['prod'] = false;
		}
	}

	resolveOptions() {
		// TODO: fine grained
	}

	resolveWebpackOptions(key, val) {
		if(key === 'progress') {
			if(val && val === 'percentage') {
				return val;
			}
		}
		if(key === 'prod' && val === true) {
			const prodConfig = require('../utils/prod-config')();
			this.opts.options = require('webpack-merge')(this.opts['options'], prodConfig);
		}
		if(key === 'dev' && val === true) {
			const devConfig = require('../utils/dev-config');
			this.opts.options =  require('webpack-merge')(this.opts['options'], devConfig);
		}
		return val;
	}
	run() {
		return this.opts;
	}
}

module.exports = BasicGroup;
