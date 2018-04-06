"use strict";

const defaultGenerator = require("../generators/add-generator");
const modifyConfigHelper = require("../utils/modify-config-helper");

/**
 * Is called and returns a scaffolding instance, adding properties
 *
 * @param	{String}	configFile - Name of the existing/default webpack configuration file
 *
 * @returns {Function}	modifyConfigHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

const DEFAULT_WEBPACK_CONFIG_FILENAME = "webpack.config.js";

module.exports = function add(...args) {
	const filePaths = args.slice(3);
	let configFile = DEFAULT_WEBPACK_CONFIG_FILENAME;
	if (filePaths.length) {
		configFile = filePaths[0];
	}
	return modifyConfigHelper("add", defaultGenerator, configFile);
};
