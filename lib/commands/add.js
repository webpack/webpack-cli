"use strict";

const defaultGenerator = require("../generators/add-generator");
const modifyConfigHelper = require("../utils/modify-config-helper");

/**
 * Is called and returns a scaffolding instance, adding properties
 *
 * @returns {Function} modifyConfigHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

module.exports = function add(inputConfigPath) {
	return modifyConfigHelper("add", defaultGenerator);
};
