const GroupHelper = require("../utils/group-helper");

class AdvancedGroup extends GroupHelper {
	constructor(options) {
		super(options);
	}
	run() {
		return this.opts;
	}
}

module.exports = AdvancedGroup;
