"use strict";
const chalk = require("chalk");
const npmExists = require("./npm-exists");
const resolvePackages = require("./resolve-packages").resolvePackages;

/**
 *
 * Loops through an array and checks if a package is registered
 * on npm and throws an error if it is not.
 *
 * @param {String[]} pkg - Array of packages to check existence of
 * @returns {Array} resolvePackages - Returns an process to install the packages
 */

module.exports = function npmPackagesExists(pkg) {
	let acceptedPackages = [];
	pkg.forEach(addon => {
		//eslint-disable-next-line
		if (addon.length <= 14 || addon.slice(0, 14) !== "webpack-addons") {
			throw new TypeError(
				chalk.bold(`${addon} isn't a valid name.\n`) +
					chalk.red(
						"\nIt should be prefixed with 'webpack-addons', but have different suffix.\n"
					)
			);
		}
		npmExists(addon)
			.then(moduleExists => {
				if (!moduleExists) {
					Error.stackTraceLimit = 0;
					throw new TypeError("Package isn't registered on npm.");
				}
				if (moduleExists) {
					acceptedPackages.push(addon);
				}
			})
			.catch(err => {
				console.error(err.stack || err);
				process.exit(0);
			})
			.then(_ => {
				if (acceptedPackages.length === pkg.length)
					return resolvePackages(acceptedPackages);
			});
	});
};
