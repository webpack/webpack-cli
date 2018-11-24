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
		for(let k in this.args) {
			if(k == 'color') {
				this.args[k]();
			}
			else if(k == 'infoVerbosity') {
				this.opts['outputOptions'][k] = this.args[k];
			}
			else {
				this.opts.options[k] = this.args[k];
			}
		}
	}

	run() {
		this.resolveOptions();
		return this.opts;
	}
}

module.exports = StatsGroup;
