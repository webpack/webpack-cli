"use strict";

const path = require("path");
const chalk = require("chalk");
const globalPath = require("global-modules");

const creator = require("../creator/index").creator;

const spawnChild = require("./package-manager").spawnChild;

/*
* @function processPromise
*
* Attaches a promise to the installation of the package
*
* @param { Function } child - The function to attach a promise to
* @returns { <Promise> } promise - Returns a promise to the installation
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

/*
* @function resolvePackages
*
* Resolves and installs the packages, later sending them to @creator
*
* @param { Array <String> } pkg - The dependencies to be installed
* @returns { <Function|Error> } creator - Builds
* a webpack configuration through yeoman or throws an error
*/

module.exports = function resolvePackages(pkg) {
	Error.stackTraceLimit = 30;

	let packageLocations = [];

	pkg.forEach(addon => {
		processPromise(spawnChild(addon))
			.then(() => {
				try {
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
				console.log("Package Coudln't be installed, aborting..");
				console.log("\nReason: \n");
				console.error(chalk.bold.red(err));
				process.exitCode = 1;
			})
			.then(() => {
				if (packageLocations.length === pkg.length)
					return creator(packageLocations);
			});
	});
};
