const fs = require("fs");
const path = require("path");
const PROP_TYPES = require("../utils/prop-types");

module.exports = function(type, args) {
	if (!PROP_TYPES.has(type)) {
		throw new Error(`${type} isn't a valid property in webpack`);
	}
	const configPath = path.resolve(process.cwd(), "webpack.config.js");
	const webpackConfigExists = fs.existsSync(configPath);
	if (webpackConfigExists) {
		const configFile = fs.readFileSync(configPath, "utf8");
		console.log(configFile);
	} else {
		throw new Error("Couldn't find a webpack configuration in your project path");
	}
	// TODO:
	// 1.read file
	// ask user what he/she wants to perform ( i.e ask for names etc)
	// write and output
	// console.log("hey", type, args, "Ho");
};
