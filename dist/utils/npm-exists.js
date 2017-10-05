"use strict";

const got = require("got");
const chalk = require("chalk");
const constant = value => () => value;

/*
* @function npmExists
*
* Checks if the given dependency/module is registered on npm
*
* @param { String } moduleName - The dependency to be checked
* @returns { <Promise> } constant - Returns either true or false,
* based on if it exists or not
*/

module.exports = function npmExists(moduleName) {
	//eslint-disable-next-line
	if (moduleName.length <= 14 || moduleName.slice(0, 14) !== "webpack-addons") {
		throw new TypeError(
			chalk.bold(`${moduleName} isn't a valid name.\n`) +
				chalk.red(
					"\nIt should be prefixed with 'webpack-addons', but have different suffix.\n"
				)
		);
	}
	const hostname = "https://www.npmjs.org";
	const pkgUrl = `${hostname}/package/${moduleName}`;
	return got(pkgUrl, {
		method: "HEAD"
	})
		.then(constant(true))
		.catch(constant(false));
};
