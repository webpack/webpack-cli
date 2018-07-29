const ErrorHelper = require("../utils/error-helper");

class BasicGroup extends ErrorHelper {
	constructor(options) {
		super(options);
		this.opts = this.arrayToObject(options);
	}
	run() {
		console.log(this.opts, "y");
		return this.opts;
	}
}

module.exports = BasicGroup;
