const fs = require("fs");
const path = require("path");
const PROP_TYPES = require("../utils/prop-types");
const runTransform = require("../init/transformations/index");

module.exports = function(type, args) {
	if (!PROP_TYPES[type]) {
		console.error(type + " isn't a valid property in webpack");
		process.exit(0);
	}
	const configPath = path.resolve(process.cwd(), "webpack.config.js");
	const webpackConfigExists = fs.existsSync(configPath);
	if (webpackConfigExists) {
		return runTransform(
			args,
			{
				config: fs.readFileSync(configPath, "utf8"),
				configPath: configPath
			},
			"add"
		);
	} else {
		throw new Error(
			"Couldn't find a webpack configuration in your project path"
		);
	}
};
