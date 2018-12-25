const GroupHelper = require("../utils/group-helper");

class BasicGroup extends GroupHelper {
	constructor(options) {
		super(options);
		this.WEBPACK_OPTION_FLAGS = ['prod', 'dev', 'watch', 'w', 'prod', 'p', 'progress', 'version', 'v'];
		this.resolveFlags();
	}
	resolveFlags() {
		const {args} = this;

		const old_args = Object.keys(args);
		const newArgs = old_args.map( arg => {
			if(arg === 'entry') {
				const isCJS = args[arg].find(a => this.WEBPACK_OPTION_FLAGS.includes(a));
				if(isCJS === 'dev') {
					args['dev'] = true;
					args['prod'] = false;
				}
				if(isCJS === 'prod') {
					args['prod'] = true;
					args['dev'] = false;
				}
				return isCJS ? null : arg;
			}
			return arg;
		}).filter(e => e);

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
				const ProgressPlugin = require("webpack").ProgressPlugin;
				const ProgressPluginVal = new ProgressPlugin();
	
				if(this.opts.options && this.opts.options.plugins) {
					this.opts.options.plugins.unshift(ProgressPluginVal)
				} else {
					this.opts.options.plugins = [ProgressPluginVal];
				}	
			}
		}
		if(key === 'prod' && val === true) {
			const prodConfig = require('../utils/prod-config')();
			this.opts.options = Object.assign(this.opts.options, prodConfig);
		}
		if(key === 'dev' && val === true) {
			const devConfig = require('../utils/dev-config');
			this.opts.options = Object.assign(this.opts.options, devConfig);
		}
		return val;
	}
	run() {
		return this.opts;
	}
}

module.exports = BasicGroup;
