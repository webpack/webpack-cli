"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const j = require("jscodeshift");
const pEachSeries = require("p-each-series");
const path = require("path");
const package_manager_1 = require("./package-manager");
const path_utils_1 = require("./path-utils");
const prop_types_1 = require("./prop-types");
const recursive_parser_1 = require("./recursive-parser");
const run_prettier_1 = require("./run-prettier");
/**
 *
 * Maps back transforms that needs to be run using the configuration
 * provided.
 *
 * @param	{Object} config 			- Configuration to transform
 * @returns {Array} - An array with keys on which transformations need to be run
 */
function mapOptionsToTransform(config) {
    return Object.keys(config.webpackOptions).filter((k) => prop_types_1.default.has(k));
}
/**
 *
 * Runs the transformations from an object we get from yeoman
 *
 * @param	{Object} transformConfig 	- Configuration to transform
 * @param	{String} action 			- Action to be done on the given ast
 * @returns {Promise} - A promise that writes each transform, runs prettier
 * and writes the file
 */
function runTransform(transformConfig, action) {
    // webpackOptions.name sent to nameTransform if match
    const webpackConfig = Object.keys(transformConfig).filter((p) => {
        return p !== "configFile" && p !== "configPath" && p !== "usingDefaults";
    });
    const initActionNotDefined = action && action !== "init" ? true : false;
    webpackConfig.forEach((scaffoldPiece) => {
        const config = transformConfig[scaffoldPiece];
        const transformations = mapOptionsToTransform(config);
        if (config.topScope && !transformations.includes("topScope")) {
            transformations.push("topScope");
        }
        if (config.merge && !transformations.includes("merge")) {
            transformations.push("merge");
        }
        const ast = j(initActionNotDefined ? transformConfig.configFile : "module.exports = {}");
        const transformAction = action || null;
        return pEachSeries(transformations, (f) => {
            if (f === "merge" || f === "topScope") {
                // TODO: typing here is difficult to understand
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return recursive_parser_1.default(j, ast, f, config[f], transformAction);
            }
            return recursive_parser_1.default(j, ast, f, config.webpackOptions[f], transformAction);
        })
            .then(() => {
            let configurationName;
            if (!config.configName) {
                configurationName = "webpack.config.js";
            }
            else {
                configurationName = "webpack." + config.configName + ".js";
            }
            const projectRoot = path_utils_1.findProjectRoot();
            const outputPath = initActionNotDefined
                ? transformConfig.configPath
                : path.join(projectRoot || process.cwd(), configurationName);
            const source = ast.toSource({
                quote: "single"
            });
            run_prettier_1.default(outputPath, source);
        })
            .catch((err) => {
            console.error(err.message ? err.message : err);
        });
    });
    const runCommand = package_manager_1.getPackageManager() === "yarn" ? "yarn build" : "npm run build";
    let successMessage = chalk_1.default.green(`Congratulations! Your new webpack configuration file has been created!\n\n`) +
        `You can now run ${chalk_1.default.green(runCommand)} to bundle your application!\n\n`;
    if (initActionNotDefined && transformConfig.config.item) {
        successMessage = chalk_1.default.green(`Congratulations! ${transformConfig.config.item} has been ${action}ed!\n`);
    }
    process.stdout.write(`\n${successMessage}`);
}
exports.default = runTransform;
//# sourceMappingURL=scaffold.js.map