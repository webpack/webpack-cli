"use strict";

const defaultGenerator = require("@webpack-cli/generators/update-generator");
const modifyHelper = require("@webpack-cli/utils/modify-config-helper");

/**
 * Is called and returns a scaffolding instance, updating properties
 *
 * @param	{String}	configFile - Name of the existing/default webpack configuration file
 *
 * @returns {Function}	modifyConfigHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

module.exports = function(configFile) {
	return modifyConfigHelper("update", defaultGenerator, configFile);
};
