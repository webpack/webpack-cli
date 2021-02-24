import { resolve } from 'path';
import { existsSync } from 'fs';
import { red, bold } from 'colorette';
import { isLocalPath } from './path-utils';
import { resolvePackages } from './resolve-packages';
import { getPathToGlobalPackages } from './global-packages-path';
const WEBPACK_SCAFFOLD_PREFIX = 'webpack-scaffold';

import got from 'got';

// TODO: to understand the type
// eslint-disable-next-line
const constant = (value: boolean) => (res): boolean | PromiseLike<boolean> => value;

/**
 *
 * Checks if the given dependency/module is registered on npm
 *
 * @param {String} moduleName - The dependency to be checked
 * @returns {Promise} constant - Returns either true or false,
 * based on if it exists or not
 */

// TODO: figure out the correct type here
// eslint-disable-next-line
export function npmExists(moduleName: string): Promise<any> {
    const hostname = 'https://www.npmjs.org';
    const pkgUrl = `${hostname}/package/${moduleName}`;
    return got(pkgUrl, {
        method: 'HEAD',
    })
        .then(constant(true))
        .catch(constant(false));
}

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

    function resolvePackagesIfReady(): void | (() => void) {
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
                process.exit(2);
            })
            .then(resolvePackagesIfReady);
    });
}
