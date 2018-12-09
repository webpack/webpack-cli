const GroupHelper = require("../utils/group-helper");

class BasicGroup extends GroupHelper {
	constructor(options) {
		super(options);
		this.WEBPACK_OPTION_FLAGS = ['prod', 'dev', 'watch', 'w', 'prod', 'p'];
	}
	resolveFlags() {
		const {args} = this;
		Object.keys(args).forEach( arg => {
			if(this.WEBPACK_OPTION_FLAGS.includes(arg)) {
				this.opts.outputOptions[arg] = args[arg];
			}
			if(arg == 'entry') {
				this.opts.options[arg] = args[arg].path;
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
		return val;
	}
	run() {
		this.resolveFlags();
		return this.opts;
	}
}

module.exports = BasicGroup;
