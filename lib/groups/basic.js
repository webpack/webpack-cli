const GroupHelper = require("../utils/group-helper");

class BasicGroup extends GroupHelper {
	constructor(options) {
		super(options);
		this.WEBPACK_OPTION_FLAGS = ['prod', 'dev', 'watch', 'w'];
	}
	resolveFlags() {
		const {args} = this;
		Object.keys(args).forEach( arg => {
			if(this.WEBPACK_OPTION_FLAGS.includes(arg)) {
				this.opts.outputOptions[arg] = this.resolveWebpackOptions(arg, args[arg]);
			}
			if(arg == 'entry') {
				this.opts.options[arg] = args[arg];
			}
		})
	}

	resolveOptions() {
		// TODO: fine grained
	}

	resolveWebpackOptions(key, val) {
		if(key === 'watch') {
			return val;
		}
	}
	run() {
		this.resolveFlags();
		return this.opts;
	}
}

module.exports = BasicGroup;
