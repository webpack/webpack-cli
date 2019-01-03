import { SpawnSyncReturns } from "child_process";

import * as spawn from "cross-spawn";
import * as fs from "fs";
import * as path from "path";

interface ISpawnFunctions {
	npm: (pkg: string, isNew: boolean) => SpawnSyncReturns<Buffer>;
	yarn: (pkg: string, isNew: boolean) => SpawnSyncReturns<Buffer>;
}

const SPAWN_FUNCTIONS: ISpawnFunctions = {
	npm: spawnNPM,
	yarn: spawnYarn,
};

/**
 *
 * Spawns a new process using npm
 *
 * @param {String} pkg - The dependency to be installed
 * @param {Boolean} isNew - indicates if it needs to be updated or installed
 * @returns {Function} spawn - Installs the package
 */

function spawnNPM(pkg: string, isNew: boolean): SpawnSyncReturns<Buffer> {
	return spawn.sync("npm", [isNew ? "install" : "update", "-g", pkg], {
		stdio: "inherit",
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

function spawnYarn(pkg: string, isNew: boolean): SpawnSyncReturns<Buffer> {
	return spawn.sync("yarn", ["global", isNew ? "add" : "upgrade", pkg], {
		stdio: "inherit",
	});
}
/**
 *
 * Spawns a new process that installs the scaffold/dependency
 *
 * @param {String} pkg - The dependency to be installed
 * @returns {Function} spawn - Installs the package
 */

export function spawnChild(pkg: string): SpawnSyncReturns<Buffer> {
	const rootPath: string = getPathToGlobalPackages();
	const pkgPath: string = path.resolve(rootPath, pkg);
	const packageManager: string = getPackageManager();
	const isNew: boolean = !fs.existsSync(pkgPath);

	return SPAWN_FUNCTIONS[packageManager](pkg, isNew);
}

/**
 *
 * Returns the name of package manager to use,
 * preferring yarn over npm if available
 *
 * @returns {String} - The package manager name
 */

export function getPackageManager(): string {
	const hasLocalNPM: boolean = fs.existsSync(
		path.resolve(process.cwd(), "package-lock.json"),
	);
	const hasLocalYarn: boolean = fs.existsSync(path.resolve(process.cwd(), "yarn.lock"));
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
export function getPathToGlobalPackages(): string {
	const manager: string = getPackageManager();

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
