"use strict";

const path = require("path");
const fs = require("fs");
const spawn = require("cross-spawn");
const globalPath = require("global-modules");

const SPAWN_FUNCTIONS = {
	npm: spawnNPM,
	yarn: spawnYarn
};

/**
 *
 * Spawns a new process using npm
 *
 * @param {String} pkg - The dependency to be installed
 * @param {Boolean} isNew - indicates if it needs to be updated or installed
 * @returns {Function} spawn - Installs the package
 */

function spawnNPM(pkg, isNew) {
	return spawn.sync("npm", [isNew ? "install" : "update", "-g", pkg], {
		stdio: "inherit"
	});
}

/**
 *
 * Spawns a new process using yarn
 *
 * @param {String} pkg - The dependency to be installed
 * @param {Boolean} isNew - indicates if it needs to be updated or installed
 * @returns {Function} spawn - Installs the package
 */

function spawnYarn(pkg, isNew) {
	return spawn.sync("yarn", ["global", isNew ? "add" : "upgrade", pkg], {
		stdio: "inherit"
	});
}
/**
 *
 * Spawns a new process that installs the addon/dependency
 *
 * @param {String} pkg - The dependency to be installed
 * @returns {Function} spawn - Installs the package
 */

function spawnChild(pkg) {
	const pkgPath = path.resolve(globalPath, pkg);
	const packageManager = getPackageManager();
	const isNew = !fs.existsSync(pkgPath);

	return SPAWN_FUNCTIONS[packageManager](pkg, isNew);
}

/**
 *
 * Returns the name of package manager to use,
 * preferring yarn over npm if available
 *
 * @returns {String} - The package manager name
 */

function getPackageManager() {
	if (spawn.sync("yarn", [" --version"], { stdio: "ignore" }).error) {
		return "npm";
	}

	return "yarn";
}

module.exports = {
	getPackageManager,
	spawnChild
};
