"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const j = require("jscodeshift");
const pEachSeries = require("p-each-series");
const path = require("path");
const prop_types_1 = require("@webpack-cli/utils/prop-types");
const recursive_parser_1 = require("@webpack-cli/utils/recursive-parser");
const run_prettier_1 = require("@webpack-cli/utils/run-prettier");
/**
 *
 * Maps back transforms that needs to be run using the configuration
 * provided.
 *
 * @param	{Object} transformObject 	- An Object with all transformations
 * @param	{Object} config 			- Configuration to transform
 * @returns {Array} - An array with the transformations to be run
 */
const mapOptionsToTransform = (config) => Object.keys(config.webpackOptions).filter((key) => prop_types_1.default.has(key));
/**
 *
 * Runs the transformations from an object we get from yeoman
 *
 * @param	{Object} webpackProperties 	- Configuration to transform
 * @param	{String} action 			- Action to be done on the given ast
 * @returns {Promise} - A promise that writes each transform, runs prettier
 * and writes the file
 */
function runTransform(webpackProperties, action) {
    // webpackOptions.name sent to nameTransform if match
    const webpackConfig = Object.keys(webpackProperties).filter((p) => p !== "configFile" && p !== "configPath");
    const initActionNotDefined = (action && action !== "init") || false;
    webpackConfig.forEach((scaffoldPiece) => {
        const config = webpackProperties[scaffoldPiece];
        const transformations = mapOptionsToTransform(config);
        const ast = j(initActionNotDefined ? webpackProperties.configFile : "module.exports = {}");
        const transformAction = action || null;
        return pEachSeries(transformations, (f) => {
            return recursive_parser_1.default(j, ast, config.webpackOptions[f], transformAction, f);
        })
            .then(() => {
            let configurationName = "webpack.config.js";
            if (config.configName) {
                configurationName = `webpack.${config.configName}.js`;
            }
            const outputPath = initActionNotDefined
                ? webpackProperties.configPath
                : path.join(process.cwd(), configurationName);
            const source = ast.toSource({
                quote: "single"
            });
            run_prettier_1.default(outputPath, source);
        })
            .catch((err) => {
            console.error(err.message ? err.message : err);
        });
    });
    let successMessage = `Congratulations! Your new webpack configuration file has been created!`;
    if (initActionNotDefined && webpackProperties.config.item) {
        successMessage = `Congratulations! ${webpackProperties.config.item} has been ${action}ed!`;
    }
    process.stdout.write("\n" + chalk_1.default.green(`${successMessage}\n`));
}
exports.default = runTransform;
//# sourceMappingURL=init.js.map