const GroupHelper = require("../utils/group-helper");

class ResolveGroup extends GroupHelper {
	constructor(options) {
		super(options);
	}
	run() {
		return this.opts;
	}
}

module.exports = ResolveGroup;
