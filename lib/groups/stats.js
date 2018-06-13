const GroupHelper = require("../utils/group-helper");

class StatsGroup extends GroupHelper {
	constructor(options) {
		super(options);
	}
	resolveOption(opt) {
		const key = Object.keys(opt)[0];
		if(key == 's') {
			opt[key]();
			return null;
		}
		return opt;
	}

	resolveOptions() {
		Object.keys(this.args).forEach( arg => {
			if(arg == 'colors' || arg == "quiet" || arg == "verbose" || arg == 'json') {
				this.opts.outputOptions[arg] = this.args[arg];
			}
			else {
				this.opts.options[arg] = this.args[arg];
			}
		});
	}

	run() {
		this.resolveOptions();
		return this.opts;
	}
}

module.exports = StatsGroup;
