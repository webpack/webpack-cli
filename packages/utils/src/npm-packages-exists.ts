import { resolve } from 'path';
import { existsSync } from 'fs';
import { red, bold } from 'colorette';
import { npmExists } from './npm-exists';
import { isLocalPath } from './path-utils';
import { resolvePackages } from './resolve-packages';
import { getPathToGlobalPackages } from '@webpack-cli/package-utils';
const WEBPACK_SCAFFOLD_PREFIX = 'webpack-scaffold';

/**
 *
 * Loops through an array and checks if a package is registered
 * on npm and throws an error if it is not.
 *
 * @param {String[]} pkg - Array of packages to check existence of
 * @returns {Array} resolvePackages - Returns a process to install the packages
 */

export function npmPackagesExists(pkg: string[]): void {
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
        if (existsSync(resolve(getPathToGlobalPackages(), scaffold))) {
            // If scaffold is already installed or is a linked package
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
                bold(`${scaffold} isn't a valid name.\n`) +
                    red(`\nIt should be prefixed with '${WEBPACK_SCAFFOLD_PREFIX}', but have different suffix.\n`),
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
                // eslint-disable-next-line no-process-exit
                process.exit(0);
            })
            .then(resolvePackagesIfReady);
    });
}
