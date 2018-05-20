"use strict";

const path = require("path");
const chalk = require("chalk");

const modifyConfigHelper = require("./modify-config-helper");

const getPathToGlobalPackages = require("./package-manager")
	.getPathToGlobalPackages;
const isLocalPath = require("./is-local-path");
const spawnChild = require("./package-manager").spawnChild;

/**
 *
 * Attaches a promise to the installation of the package
 *
 * @param {Function} child - The function to attach a promise to
 * @returns {Promise} promise - Returns a promise to the installation
 */

function processPromise(child) {
	return new Promise(function(resolve, reject) {
		//eslint-disable-line
		if (child.status !== 0) {
			reject();
		} else {
			resolve();
		}
	});
}

/**
 *
 * Resolves and installs the packages, later sending them to @creator
 *
 * @param {String[]} pkg - The dependencies to be installed
 * @returns {Function|Error} creator - Builds
 * a webpack configuration through yeoman or throws an error
 */

function resolvePackages(pkg) {
	Error.stackTraceLimit = 30;

	let packageLocations = [];

	function invokeGeneratorIfReady() {
		if (packageLocations.length === pkg.length)
			return modifyConfigHelper("init", null, packageLocations);
	}

	pkg.forEach(addon => {
		// Resolve paths to modules on local filesystem
		if (isLocalPath(addon)) {
			let absolutePath = addon;

			try {
				absolutePath = path.resolve(process.cwd(), addon);
				require.resolve(absolutePath);
				packageLocations.push(absolutePath);
			} catch (err) {
				console.log(`Cannot find a generator at ${absolutePath}.`);
				console.log("\nReason:\n");
				console.error(chalk.bold.red(err));
				process.exitCode = 1;
			}

			invokeGeneratorIfReady();
			return;
		}

		// Resolve modules on npm registry
		processPromise(spawnChild(addon))
			.then(_ => {
				try {
					const globalPath = getPathToGlobalPackages();
					packageLocations.push(path.resolve(globalPath, addon));
				} catch (err) {
					console.log("Package wasn't validated correctly..");
					console.log("Submit an issue for", pkg, "if this persists");
					console.log("\nReason: \n");
					console.error(chalk.bold.red(err));
					process.exitCode = 1;
				}
			})
			.catch(err => {
				console.log("Package couldn't be installed, aborting..");
				console.log("\nReason: \n");
				console.error(chalk.bold.red(err));
				process.exitCode = 1;
			})
			.then(invokeGeneratorIfReady);
	});
}

module.exports = {
	resolvePackages,
	processPromise
};
