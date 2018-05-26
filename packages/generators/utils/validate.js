"use strict";

/**
 *
 * Validates an input to check if an input is provided
 *
 * @param {String} value - The input string to validate
 * @returns {String | Boolean } Returns truthy if its long enough
 * Or a string if the user hasn't written anything
 */
module.exports = value => {
	const pass = value.length;
	if (pass) {
		return true;
	}
	return "Please specify an answer!";
};
