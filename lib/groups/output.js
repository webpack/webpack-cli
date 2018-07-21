const ErrorHelper = require("../utils/error-helper");

class OutputGroup extends ErrorHelper {
	constructor(options) {
		super(options);
		this.opts = this.arrayToObject(options);
	}
	run() {
		return this.opts;
	}
}

module.exports = OutputGroup;
