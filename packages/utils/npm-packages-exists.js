"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const chalk_1 = require("chalk");
const npm_exists_1 = require("./npm-exists");
const path_utils_1 = require("./path-utils");
const resolve_packages_1 = require("./resolve-packages");
const package_manager_1 = require("./package-manager");
const WEBPACK_SCAFFOLD_PREFIX = "webpack-scaffold";
/**
 *
 * Loops through an array and checks if a package is registered
 * on npm and throws an error if it is not.
 *
 * @param {String[]} pkg - Array of packages to check existence of
 * @returns {Array} resolvePackages - Returns a process to install the packages
 */
function npmPackagesExists(pkg) {
    const acceptedPackages = [];
    function resolvePackagesIfReady() {
        if (acceptedPackages.length === pkg.length) {
            return resolve_packages_1.resolvePackages(acceptedPackages);
        }
    }
    pkg.forEach((scaffold) => {
        if (path_utils_1.isLocalPath(scaffold)) {
            // If the scaffold is a path to a local folder, no name validation is necessary.
            acceptedPackages.push(scaffold);
            resolvePackagesIfReady();
            return;
        }
        if (fs_1.existsSync(path_1.resolve(package_manager_1.getPathToGlobalPackages(), scaffold))) {
            // If scaffold is already installed or is a linked package
            acceptedPackages.push(scaffold);
            resolvePackagesIfReady();
            return;
        }
        // The scaffold is on npm; validate name and existence
        if (scaffold.length <= WEBPACK_SCAFFOLD_PREFIX.length ||
            scaffold.slice(0, WEBPACK_SCAFFOLD_PREFIX.length) !== WEBPACK_SCAFFOLD_PREFIX) {
            throw new TypeError(chalk_1.default.bold(`${scaffold} isn't a valid name.\n`) +
                chalk_1.default.red(`\nIt should be prefixed with '${WEBPACK_SCAFFOLD_PREFIX}', but have different suffix.\n`));
        }
        npm_exists_1.default(scaffold)
            .then((moduleExists) => {
            if (moduleExists) {
                acceptedPackages.push(scaffold);
            }
            else {
                Error.stackTraceLimit = 0;
                throw new TypeError(`Cannot resolve location of package ${scaffold}.`);
            }
        })
            .catch((err) => {
            console.error(err.stack || err);
            process.exit(0);
        })
            .then(resolvePackagesIfReady);
    });
}
exports.default = npmPackagesExists;
//# sourceMappingURL=npm-packages-exists.js.map