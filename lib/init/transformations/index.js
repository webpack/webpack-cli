"use strict";

const path = require("path");
const j = require("jscodeshift");
const chalk = require("chalk");
const pEachSeries = require("p-each-series");

const runPrettier = require("../../utils/run-prettier");

const entryTransform = require("./entry/entry");
const outputTransform = require("./output/output");
const contextTransform = require("./context/context");
const resolveTransform = require("./resolve/resolve");
const devtoolTransform = require("./devtool/devtool");
const targetTransform = require("./target/target");
const watchTransform = require("./watch/watch");
const watchOptionsTransform = require("./watch/watchOptions");
const externalsTransform = require("./externals/externals");
const nodeTransform = require("./node/node");
const performanceTransform = require("./performance/performance");
const statsTransform = require("./stats/stats");
const amdTransform = require("./other/amd");
const bailTransform = require("./other/bail");
const cacheTransform = require("./other/cache");
const profileTransform = require("./other/profile");
const mergeTransform = require("./other/merge");
const parallelismTransform = require("./other/parallelism");
const recordsInputPathTransform = require("./other/recordsInputPath");
const recordsOutputPathTransform = require("./other/recordsOutputPath");
const recordsPathTransform = require("./other/recordsPath");
const moduleTransform = require("./module/module");
const pluginsTransform = require("./plugins/plugins");
const topScopeTransform = require("./top-scope/top-scope");
const devServerTransform = require("./devServer/devServer");
const modeTransform = require("./mode/mode");
const resolveLoaderTransform = require("./resolveLoader/resolveLoader");

/**
 *
 * Runs the transformations from an object we get from yeoman
 *
 * @param {Object} webpackProperties - Configuration to transform
 * @param {String} action - Action to be done on the given ast
 * @returns {Promise} - A promise that writes each transform, runs prettier
 * and writes the file
 */

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
	resolveLoaderTransform
};

module.exports = function runTransform(webpackProperties, action) {
	// webpackOptions.name sent to nameTransform if match
	const webpackConfig = action
		? { config: webpackProperties.config }
		: webpackProperties;
	Object.keys(webpackConfig).forEach(scaffoldPiece => {
		const config = webpackConfig[scaffoldPiece];
		const transformations = Object.keys(transformsObject)
			.map(k => {
				const stringVal = k.substr(0, k.indexOf("Transform"));
				if (config.webpackOptions) {
					if (config.webpackOptions[stringVal]) {
						return [transformsObject[k], config.webpackOptions[stringVal]];
					} else {
						return [transformsObject[k], config[stringVal]];
					}
				} else {
					return [transformsObject[k]];
				}
			})
			.filter(e => e[1]);

		const ast = j(
			action && action !== "init"
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
				if (!config.configName && action !== "init") {
					configurationName = "webpack.config.js";
				} else {
					configurationName = "webpack." + config.configName + ".js";
				}

				const outputPath =
					action && action !== "init"
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
	if (action && webpackProperties.config.item) {
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
