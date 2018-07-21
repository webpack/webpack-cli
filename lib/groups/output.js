const ErrorHelper = require("../utils/error-helper");

class OutputGroup extends ErrorHelper {
	constructor(options) {
		super(options);
		this.opts = this.processOptions(options);
	}
	run() {
		return this.opts;
	}
}

module.exports = OutputGroup;
