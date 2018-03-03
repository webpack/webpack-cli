"use strict";
const chalk = require("chalk");
const isLocalPath = require("./is-local-path");
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

	function resolvePackagesIfReady() {
		if (acceptedPackages.length === pkg.length)
			return resolvePackages(acceptedPackages);
	}

	pkg.forEach(addon => {
		if (isLocalPath(addon)) {
			// If the addon is a path to a local folder, no name validation is necessary.
			acceptedPackages.push(addon);
			resolvePackagesIfReady();
			return;
		}

		// The addon is on npm; validate name and existence
		// eslint-disable-next-line
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
					throw new TypeError(`Cannot resolve location of package ${addon}.`);
				}
				if (moduleExists) {
					acceptedPackages.push(addon);
				}
			})
			.catch(err => {
				console.error(err.stack || err);
				process.exit(0);
			})
			.then(resolvePackagesIfReady);
	});
};
