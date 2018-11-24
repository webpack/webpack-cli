const GroupHelper = require("../utils/group-helper");

class ModuleGroup extends GroupHelper {
	constructor(options) {
		super(options);
	}
	run() {
		return this.opts;
	}
}

module.exports = ModuleGroup;
