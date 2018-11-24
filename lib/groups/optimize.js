const GroupHelper = require("../utils/group-helper");

class OptimizeGroup extends GroupHelper {
	constructor(options) {
		super(options);
	}
	run() {
		return this.opts;
	}
}

module.exports = OptimizeGroup;
