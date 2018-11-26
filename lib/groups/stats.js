const GroupHelper = require("../utils/group-helper");

class StatsGroup extends GroupHelper {
	constructor(options) {
		super(options);
	}
	resolveOption(opt) {
		const key = Object.keys(opt)[0];
		if(key == 'color') {
			opt[key]();
			return null;
		}
		return opt;
	}

	resolveOptions() {
		Object.keys(this.args).forEach( arg => {
			if(arg == 'color') {
				this.args[arg]();
			}
			else if(arg == 'infoVerbosity') {
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
