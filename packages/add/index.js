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

module.exports = function add(filePaths) {
	const DEFAULT_WEBPACK_CONFIG_FILENAME = "webpack.config.js";

	let configFile = DEFAULT_WEBPACK_CONFIG_FILENAME;
	if (filePaths.length) {
		configFile = filePaths[0];
	}
	return modifyConfigHelper("add", defaultGenerator, configFile);
};
