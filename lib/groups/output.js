const GroupHelper = require("../utils/group-helper");

class OutputGroup extends GroupHelper {
	constructor(options) {
		super(options);
	}

	resolveOptions() {
		let newArgs = {
			output: {}
		};
		const {args} = this;
		if(args) {
			if(args.filename) {
				newArgs.output.filename = args.filename;
			} else {
				newArgs.output.filename = "bundle.js";
			}
			if(args.output.path) {
				newArgs.output['path'] = ArgsValidator.resolveFileDirectory(args.output.path, "dist")
			}
		}
		this.opts.options = this.mergeRecursive(this.opts.options, newArgs);
	}

	run() {
		this.resolveOptions();
		return this.opts;
	}
}

module.exports = OutputGroup;
