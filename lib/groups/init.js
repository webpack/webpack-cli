const GroupHelper = require("../utils/group-helper");

class InitGroup extends GroupHelper {
	constructor(options) {
		super(options);
	}
	run() {
		return this.opts;
	}
}

module.exports = InitGroup;
