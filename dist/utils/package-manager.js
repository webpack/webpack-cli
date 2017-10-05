"use strict";

const path = require("path");
const fs = require("fs");
const spawn = require("cross-spawn");
const globalPath = require("global-modules");

const SPAWN_FUNCTIONS = {
	npm: spawnNPM,
	yarn: spawnYarn
};

function spawnNPM(pkg, isNew) {
	return spawn.sync("npm", [isNew ? "install" : "update", "-g", pkg], {
		stdio: "inherit"
	});
}

function spawnYarn(pkg, isNew) {
	return spawn.sync("yarn", ["global", isNew ? "add" : "upgrade", pkg], {
		stdio: "inherit"
	});
}
/*
* @function spawnChild
*
* Spawns a new process that installs the addon/dependency
*
* @param { String } pkg - The dependency to be installed
* @returns { <Function> } spawn - Installs the package
*/

function spawnChild(pkg) {
	const pkgPath = path.resolve(globalPath, pkg);
	const packageManager = getPackageManager();
	const isNew = !fs.existsSync(pkgPath);

	return SPAWN_FUNCTIONS[packageManager](pkg, isNew);
}

/*
* @function getPackageManager
*
* Returns the name of package manager to use,
* preferring yarn over npm if available
*
* @returns { String } - The package manager name
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
