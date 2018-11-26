"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_generator_1 = require("@webpack-cli/generators/add-generator");
const modify_config_helper_1 = require("@webpack-cli/utils/modify-config-helper");
/**
 * Is called and returns a scaffolding instance, adding properties
 *
 * @param	{String[]} args - array of arguments such as
 * @returns {Function} modifyConfigHelper - A helper function that uses the action
 * 	we're given on a generator
 *
 */
function add(...args) {
    const DEFAULT_WEBPACK_CONFIG_FILENAME = "webpack.config.js";
    const filePaths = args.slice(3);
    let configFile = DEFAULT_WEBPACK_CONFIG_FILENAME;
    if (filePaths.length) {
        configFile = filePaths[0];
    }
    return modify_config_helper_1.default("add", add_generator_1.default, configFile);
}
exports.default = add;
