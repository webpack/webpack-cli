"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const path = require("path");
const modify_config_helper_1 = require("./modify-config-helper");
const package_manager_1 = require("./package-manager");
const package_manager_2 = require("./package-manager");
const path_utils_1 = require("./path-utils");
/**
 *
 * Attaches a promise to the installation of the package
 *
 * @param {Function} child - The function to attach a promise to
 * @returns {Promise} promise - Returns a promise to the installation
 */
function processPromise(child) {
    return new Promise((resolve, reject) => {
        if (child.status !== 0) {
            reject();
        }
        else {
            resolve();
        }
    });
}
exports.processPromise = processPromise;
/**
 *
 * Resolves and installs the packages, later sending them to @creator
 *
 * @param {String[]} pkg - The dependencies to be installed
 * @returns {Function|Error} creator - Builds
 * a webpack configuration through yeoman or throws an error
 */
function resolvePackages(pkg) {
    Error.stackTraceLimit = 30;
    const packageLocations = [];
    function invokeGeneratorIfReady() {
        if (packageLocations.length === pkg.length) {
            modify_config_helper_1.default("init", null, null, packageLocations);
        }
    }
    pkg.forEach((scaffold) => {
        // Resolve paths to modules on local filesystem
        if (path_utils_1.isLocalPath(scaffold)) {
            let absolutePath = scaffold;
            try {
                absolutePath = path.resolve(process.cwd(), scaffold);
                require.resolve(absolutePath);
                packageLocations.push(absolutePath);
            }
            catch (err) {
                console.error(`Cannot find a generator at ${absolutePath}.`);
                console.error("\nReason:\n");
                console.error(chalk_1.default.bold.red(err));
                process.exitCode = 1;
            }
            invokeGeneratorIfReady();
            return;
        }
        // Resolve modules on npm registry
        processPromise(package_manager_2.spawnChild(scaffold))
            .then(() => {
            try {
                const globalPath = package_manager_1.getPathToGlobalPackages();
                packageLocations.push(path.resolve(globalPath, scaffold));
            }
            catch (err) {
                console.error("Package wasn't validated correctly..");
                console.error("Submit an issue for", pkg, "if this persists");
                console.error("\nReason: \n");
                console.error(chalk_1.default.bold.red(err));
                process.exitCode = 1;
            }
        })
            .catch((err) => {
            console.error("Package couldn't be installed, aborting..");
            console.error("\nReason: \n");
            console.error(chalk_1.default.bold.red(err));
            process.exitCode = 1;
        })
            .then(invokeGeneratorIfReady);
    });
}
exports.resolvePackages = resolvePackages;
//# sourceMappingURL=resolve-packages.js.map