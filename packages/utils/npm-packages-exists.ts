import chalk from "chalk";

import npmExists from "./npm-exists";
import { isLocalPath } from "./path-utils";
import { resolvePackages } from "./resolve-packages";

const WEBPACK_SCAFFOLD_PREFIX = "webpack-scaffold";

/**
 *
 * Loops through an array and checks if a package is registered
 * on npm and throws an error if it is not.
 *
 * @param {String[]} pkg - Array of packages to check existence of
 * @returns {Array} resolvePackages - Returns an process to install the packages
 */

export default function npmPackagesExists(pkg: string[]): void {
	const acceptedPackages: string[] = [];

	function resolvePackagesIfReady(): void | Function {
		if (acceptedPackages.length === pkg.length) {
			return resolvePackages(acceptedPackages);
		}
	}

	pkg.forEach((scaffold: string): void => {
		if (isLocalPath(scaffold)) {
			// If the scaffold is a path to a local folder, no name validation is necessary.
			acceptedPackages.push(scaffold);
			resolvePackagesIfReady();
			return;
		}

		// The scaffold is on npm; validate name and existence
		if (
			scaffold.length <= WEBPACK_SCAFFOLD_PREFIX.length ||
			scaffold.slice(0, WEBPACK_SCAFFOLD_PREFIX.length) !== WEBPACK_SCAFFOLD_PREFIX
		) {
			throw new TypeError(
				chalk.bold(`${scaffold} isn't a valid name.\n`) +
					chalk.red(`\nIt should be prefixed with '${WEBPACK_SCAFFOLD_PREFIX}', but have different suffix.\n`)
			);
		}

		npmExists(scaffold)
			.then((moduleExists: boolean): void => {
				if (moduleExists) {
					acceptedPackages.push(scaffold);
				} else {
					Error.stackTraceLimit = 0;
					throw new TypeError(`Cannot resolve location of package ${scaffold}.`);
				}
			})
			.catch((err: Error): void => {
				console.error(err.stack || err);
				process.exit(0);
			})
			.then(resolvePackagesIfReady);
	});
}
