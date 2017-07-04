"use strict";

const npmExists = require("./npm-exists");
const resolvePackages = require("./resolve-packages");

/*
* @function npmPackagesExists
*
* Loops through an array and checks if a package is registered
* on npm and throws an error if it is not.
*
* @param { Array <String> } pkg - Array of packages to check existence of
* @returns { Array } resolvePackages - Returns an process to install the packages
*/

module.exports = function npmPackagesExists(pkg) {
	let acceptedPackages = [];
	pkg.forEach(addon => {
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
			.then(() => {
				if (acceptedPackages.length === pkg.length)
					return resolvePackages(acceptedPackages);
			});
	});
};
