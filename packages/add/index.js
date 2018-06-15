"use strict";

const defaultGenerator = require("@webpack-cli/generators/add-generator");
const modifyConfigHelper = require("@webpack-cli/utils/modify-config-helper");

/**
 * Is called and returns a scaffolding instance, adding properties
 *
 * @returns {Function} modifyConfigHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

module.exports = function add(...args) {
	const DEFAULT_WEBPACK_CONFIG_FILENAME = "webpack.config.js";

	const filePaths = args.slice(3);
	let configFile = DEFAULT_WEBPACK_CONFIG_FILENAME;
	if (filePaths.length) {
		configFile = filePaths[0];
	}
	return modifyConfigHelper("add", defaultGenerator, configFile);
};
