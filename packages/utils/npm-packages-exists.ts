import chalk from "chalk";

import isLocalPath from "./is-local-path";
import npmExists from "./npm-exists";
import { resolvePackages } from "./resolve-packages";

const WEBPACK_SCAFFOLD_PREFIX: string = "webpack-scaffold";

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

	function resolvePackagesIfReady() {
		if (acceptedPackages.length === pkg.length) {
			return resolvePackages(acceptedPackages);
		}
	}

	pkg.forEach((addon: string): void => {
		if (isLocalPath(addon)) {
			// If the addon is a path to a local folder, no name validation is necessary.
			acceptedPackages.push(addon);
			resolvePackagesIfReady();
			return;
		}

		// The addon is on npm; validate name and existence
		if (
			addon.length <= WEBPACK_SCAFFOLD_PREFIX.length ||
			addon.slice(0, WEBPACK_SCAFFOLD_PREFIX.length) !== WEBPACK_SCAFFOLD_PREFIX
		) {
			throw new TypeError(
				chalk.bold(`${addon} isn't a valid name.\n`) +
					chalk.red(
						`\nIt should be prefixed with '${WEBPACK_SCAFFOLD_PREFIX}', but have different suffix.\n`,
					),
			);
		}

		npmExists(addon)
			.then((moduleExists: boolean) => {
				if (!moduleExists) {
					Error.stackTraceLimit = 0;
					throw new TypeError(`Cannot resolve location of package ${addon}.`);
				}
				if (moduleExists) {
					acceptedPackages.push(addon);
				}
			})
			.catch((err: IError) => {
				console.error(err.stack || err);
				process.exit(0);
			})
			.then(resolvePackagesIfReady);
	});
}
