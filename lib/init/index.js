"use strict";

const path = require("path");
const j = require("jscodeshift");
const chalk = require("chalk");
const pEachSeries = require("p-each-series");

const runPrettier = require("../utils/run-prettier");

const entryTransform = require("./transformations/entry/entry");
const outputTransform = require("./transformations/output/output");
const contextTransform = require("./transformations/context/context");
const resolveTransform = require("./transformations/resolve/resolve");
const devtoolTransform = require("./transformations/devtool/devtool");
const targetTransform = require("./transformations/target/target");
const watchTransform = require("./transformations/watch/watch");
const watchOptionsTransform = require("./transformations/watch/watchOptions");
const externalsTransform = require("./transformations/externals/externals");
const nodeTransform = require("./transformations/node/node");
const performanceTransform = require("./transformations/performance/performance");
const statsTransform = require("./transformations/stats/stats");
const amdTransform = require("./transformations/other/amd");
const bailTransform = require("./transformations/other/bail");
const cacheTransform = require("./transformations/other/cache");
const profileTransform = require("./transformations/other/profile");
const mergeTransform = require("./transformations/other/merge");
const parallelismTransform = require("./transformations/other/parallelism");
const recordsInputPathTransform = require("./transformations/other/recordsInputPath");
const recordsOutputPathTransform = require("./transformations/other/recordsOutputPath");
const recordsPathTransform = require("./transformations/other/recordsPath");
const moduleTransform = require("./transformations/module/module");
const pluginsTransform = require("./transformations/plugins/plugins");
const topScopeTransform = require("./transformations/top-scope/top-scope");
const devServerTransform = require("./transformations/devServer/devServer");
const modeTransform = require("./transformations/mode/mode");
const resolveLoaderTransform = require("./transformations/resolveLoader/resolveLoader");
const optimizationTransform = require("./transformations/optimization/optimization");

const transformsObject = {
	entryTransform,
	outputTransform,
	contextTransform,
	resolveTransform,
	devtoolTransform,
	targetTransform,
	watchTransform,
	watchOptionsTransform,
	externalsTransform,
	nodeTransform,
	performanceTransform,
	statsTransform,
	amdTransform,
	bailTransform,
	cacheTransform,
	profileTransform,
	moduleTransform,
	pluginsTransform,
	topScopeTransform,
	mergeTransform,
	devServerTransform,
	modeTransform,
	parallelismTransform,
	recordsInputPathTransform,
	recordsOutputPathTransform,
	recordsPathTransform,
	resolveLoaderTransform,
	optimizationTransform
};

/**
 *
 * Maps back transforms that needs to be run using the configuration
 * provided.
 *
 * @param	{Object} transformObject 	- An Object with all transformations
 * @param	{Object} config 			- Configuration to transform
 * @returns {Object} - An Object with the transformations to be run
 */

function mapOptionsToTransform(transformObject, config) {
	return Object.keys(transformObject)
		.map(transformKey => {
			const stringVal = transformKey.substr(
				0,
				transformKey.indexOf("Transform")
			);
			if (Object.keys(config.webpackOptions).length) {
				if (config.webpackOptions[stringVal]) {
					return [
						transformObject[transformKey],
						config.webpackOptions[stringVal]
					];
				} else {
					return [transformObject[transformKey], config[stringVal]];
				}
			} else {
				return [transformObject[transformKey]];
			}
		})
		.filter(e => e[1]);
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
		const transformations = mapOptionsToTransform(transformsObject, config);
		const ast = j(
			initActionNotDefined
				? webpackProperties.configFile
				: "module.exports = {}"
		);
		const transformAction = action || null;

		return pEachSeries(transformations, f => {
			if (!f[1]) {
				return f[0](j, ast, transformAction);
			} else {
				return f[0](j, ast, f[1], transformAction);
			}
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
