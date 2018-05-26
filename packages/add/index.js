"use strict";

const defaultGenerator = require("@webpack-cli/generators/add-generator");
const modifyHelper = require("@webpack-cli/utils/modify-config-helper");

/**
 * Is called and returns a scaffolding instance, adding properties
 *
 * @returns {Function} modifyHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */

module.exports = function add() {
	return modifyHelper("add", defaultGenerator);
};
