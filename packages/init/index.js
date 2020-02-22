"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_generator_1 = require("@webpack-cli/generators/init-generator");
const modify_config_helper_1 = require("@webpack-cli/utils/modify-config-helper");
const npm_packages_exists_1 = require("@webpack-cli/utils/npm-packages-exists");
const AUTO_PREFIX = '--auto';
/**
 *
 * First function to be called after running the init flag. This is a check,
 * if we are running the init command with no arguments or if we got dependencies
 *
 * @param	{String[]}		args - array of arguments such as
 * packages included when running the init command
 * @returns	{Function}	creator/npmPackagesExists - returns an installation of the package,
 * followed up with a yeoman instance if there are packages. If not, it creates a defaultGenerator
 */
function initializeInquirer(...args) {
    const packages = args;
    const includesDefaultPrefix = packages.includes(AUTO_PREFIX);
    if (packages.length === 0 || includesDefaultPrefix) {
        return modify_config_helper_1.default('init', init_generator_1.default, null, null, includesDefaultPrefix);
    }
    return npm_packages_exists_1.default(packages);
}
exports.default = initializeInquirer;
//# sourceMappingURL=index.js.map