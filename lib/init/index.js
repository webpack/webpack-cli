"use strict";

const path = require("path");
const j = require("jscodeshift");
const chalk = require("chalk");
const pEachSeries = require("p-each-series");

const runPrettier = require("../utils/run-prettier");
const astTransform = require("../ast");
const propTypes = require("../utils/prop-types");

/**
 *
 * Maps back transforms that needs to be run using the configuration
 * provided.
 *
 * @param	{Object} transformObject 	- An Object with all transformations
 * @param	{Object} config 			- Configuration to transform
 * @returns {Object} - An Object with the transformations to be run
 */

function mapOptionsToTransform(config) {
	return Object.keys(config.webpackOptions).filter(k => propTypes.has(k));
}

/**
 *
 * Runs the transformations from an object we get from yeoman
 *
 * @param	{Object} webpackProperties 	- Configuration to transform
 * @param	{String} action 			- Action to be done on the given ast
 * @returns {Promise} - A promise that writes each transform, runs prettier
 * and writes the file
 */

module.exports = function runTransform(webpackProperties, action) {
	// webpackOptions.name sent to nameTransform if match
	const webpackConfig = Object.keys(webpackProperties).filter(p => {
		return p !== "configFile" && p !== "configPath";
	});
	const initActionNotDefined = action && action !== "init" ? true : false;

	webpackConfig.forEach(scaffoldPiece => {
		const config = webpackProperties[scaffoldPiece];
		const transformations = mapOptionsToTransform(config);
		const ast = j(
			initActionNotDefined
				? webpackProperties.configFile
				: "module.exports = {}"
		);
		const transformAction = action || null;

		return pEachSeries(transformations, f => {
			return astTransform(j, ast, config.webpackOptions[f], transformAction, f);
		})
			.then(_ => {
				let configurationName;
				if (!config.configName) {
					configurationName = "webpack.config.js";
				} else {
					configurationName = "webpack." + config.configName + ".js";
				}

				const outputPath = initActionNotDefined
					? webpackProperties.configPath
					: path.join(process.cwd(), configurationName);
				const source = ast.toSource({
					quote: "single"
				});

				runPrettier(outputPath, source);
			})
			.catch(err => {
				console.error(err.message ? err.message : err);
			});
	});
	if (initActionNotDefined && webpackProperties.config.item) {
		process.stdout.write(
			"\n" +
				chalk.green(
					`Congratulations! ${
						webpackProperties.config.item
					} has been ${action}ed!\n`
				)
		);
	} else {
		process.stdout.write(
			"\n" +
				chalk.green(
					"Congratulations! Your new webpack configuration file has been created!\n"
				)
		);
	}
};
