"use strict";

const defaultGenerator = require("@webpack-cli/generators/remove-generator");
const modifyHelper = require("@webpack-cli/utils/modify-config-helper");

/**
 * Is called and returns a scaffolding instance, removing properties
 *
 * @returns {Function} modifyHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

module.exports = function() {
	return modifyHelper("remove", defaultGenerator);
};
