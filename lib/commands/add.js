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

module.exports = function add(configFile) {
	return modifyConfigHelper("add", defaultGenerator, configFile);
};
