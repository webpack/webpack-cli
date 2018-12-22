const GroupHelper = require("../utils/group-helper");

class BasicGroup extends GroupHelper {
	constructor(options) {
		super(options);
		this.WEBPACK_OPTION_FLAGS = ['prod', 'dev', 'watch', 'w', 'prod', 'p', 'progress', 'version', 'v'];
		this.resolveFlags();
	}
	resolveFlags() {
		const {args} = this;
		Object.keys(args).forEach( arg => {
			if(this.WEBPACK_OPTION_FLAGS.includes(arg)) {
				this.opts.outputOptions[arg] = this.resolveWebpackOptions(arg, args[arg]);
			}
			if(arg == 'sourcemap') {
				this.opts.options.devtool = args[arg] || 'eval';
			}
			if(arg == 'entry') {
				let is0CJS;
				if(Array.isArray(args[arg])) {
					this.WEBPACK_OPTION_FLAGS.forEach(flag => {
						if(args[arg].includes(flag)) {
							is0CJS = true;
						}
					})
				}
				if(!is0CJS) {
					this.opts.options[arg] = this.resolveFilePath(args[arg], 'index');
				}
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
		return val;
	}
	run() {
		return this.opts;
	}
}

module.exports = BasicGroup;
