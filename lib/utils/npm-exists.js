"use strict";

const got = require("got");
const constant = value => _ => value;

/**
 *
 * Checks if the given dependency/module is registered on npm
 *
 * @param {String} moduleName - The dependency to be checked
 * @returns {Promise} constant - Returns either true or false,
 * based on if it exists or not
 */

module.exports = function npmExists(moduleName) {
	const hostname = "https://www.npmjs.org";
	const pkgUrl = `${hostname}/package/${moduleName}`;
	return got(pkgUrl, {
		method: "HEAD"
	})
		.then(constant(true))
		.catch(constant(false));
};
