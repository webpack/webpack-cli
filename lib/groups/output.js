const GroupHelper = require("../utils/group-helper");

class OutputGroup extends GroupHelper {
	constructor(options) {
		super(options);
	}
	run() {

		return this.opts;
	}
}

module.exports = OutputGroup;
