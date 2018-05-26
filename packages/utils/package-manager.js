"use strict";

const path = require("path");
const fs = require("fs");
const spawn = require("cross-spawn");

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
	const rootPath = getPathToGlobalPackages();
	const pkgPath = path.resolve(rootPath, pkg);
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
	const hasLocalNPM = fs.existsSync(
		path.resolve(process.cwd(), "package-lock.json")
	);
	const hasLocalYarn = fs.existsSync(path.resolve(process.cwd(), "yarn.lock"));
	if (hasLocalNPM) {
		return "npm";
	} else if (hasLocalYarn) {
		return "yarn";
	} else if (spawn.sync("yarn", [" --version"], { stdio: "ignore" }).error) {
		return "npm";
	} else {
		return "yarn";
	}
}

/**
 *
 * Returns the path to globally installed
 * npm packages, depending on the available
 * package manager determined by `getPackageManager`
 *
 * @returns {String} path - Path to global node_modules folder
 */
function getPathToGlobalPackages() {
	const manager = getPackageManager();

	if (manager === "yarn") {
		try {
			const yarnDir = spawn
				.sync("yarn", ["global", "dir"])
				.stdout.toString()
				.trim();
			return path.join(yarnDir, "node_modules");
		} catch (e) {
			// Default to the global npm path below
		}
	}

	return require("global-modules");
}

module.exports = {
	getPackageManager,
	getPathToGlobalPackages,
	spawnChild
};
