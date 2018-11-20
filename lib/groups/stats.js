const ErrorHelper = require("../utils/error-helper");

class StatsGroup extends ErrorHelper {
	constructor(options) {
		super(options);
		this.opts = this.arrayToObject(options);
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
		let newRes = {
			outputOptions: {},
			options: {}
		};
		for(let k in this.opts) {
			if(k == 'color') {
				this.opts[k]();
			}
			else if(k == 'infoVerbosity') {
				newRes['outputOptions'][k] = this.opts[k];
			}
			else {
				newRes.options[k] = this.opts[k];
			}
		}
		return newRes;
	}

	run() {
		const res = this.resolveOptions();
		return res;
	}
}

module.exports = StatsGroup;
