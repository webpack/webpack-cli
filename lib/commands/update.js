"use strict";

const defaultGenerator = require("../generators/update-generator");
const modifyConfigHelper = require("../utils/modify-config-helper");

/**
 * Is called and returns a scaffolding instance, updating properties
 *
 * @returns {Function} modifyConfigHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

module.exports = function() {
	return modifyConfigHelper("update", defaultGenerator);
};
