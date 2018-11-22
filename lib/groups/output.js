const ErrorHelper = require("../utils/error-helper");

class OutputGroup extends ErrorHelper {
	constructor(options) {
		super(options);
		this.opts = this.arrayToObject(options);
	}
	run() {

		return {
			output: this.opts,
			outputOptions: {}
		};
	}
}

module.exports = OutputGroup;
