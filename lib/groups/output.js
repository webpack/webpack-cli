const GroupHelper = require("../utils/group-helper");

class OutputGroup extends GroupHelper {
	constructor(options) {
		super(options);
	}

	resolveOptions() {
		this.opts.options = this.mergeRecursive(this.opts.options, this.args);
	}

	run() {
		this.resolveOptions();
		return this.opts;
	}
}

module.exports = OutputGroup;
