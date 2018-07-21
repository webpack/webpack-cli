"use strict";

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const yeoman = require("yeoman-environment");
const Generator = require("yeoman-generator");
const logSymbols = require("log-symbols");
const runTransform = require("./scaffold");

/**
 *
 * Looks up the webpack.config in the user's path and runs a given
 * generator scaffold followed up by a transform
 *
 * @param {String} action — action to be done (add, remove, update, init)
 * @param {Class} generator - Yeoman generator class
 * @param {String} configFile - Name of the existing/default webpack configuration file
 * @param {Array} packages - List of packages to resolve
 * @returns {Function} runTransform - Returns a transformation instance
 */

module.exports = function modifyHelperUtil(
	action,
	generator,
	configFile,
	packages
) {
	let configPath = null;

	if (action !== "init") {
		configPath = path.resolve(process.cwd(), configFile);
		const webpackConfigExists = fs.existsSync(configPath);
		if (webpackConfigExists) {
			process.stdout.write(
				"\n" +
					logSymbols.success +
					chalk.green(" SUCCESS ") +
					"Found config " +
					chalk.cyan(configFile + "\n") +
					"\n"
			);
		} else {
			process.stdout.write(
				"\n" +
					logSymbols.error +
					chalk.red(" ERROR ") +
					chalk.cyan(configFile) +
					" not found. Please specify a valid path to your webpack config like " +
					chalk.white("$ ") +
					chalk.cyan(`webpack-cli ${action} webpack.dev.js`) +
					"\n"
			);
			return;
		}
	}

	const env = yeoman.createEnv("webpack", null);
	const generatorName = `webpack-${action}-generator`;

	if (!generator) {
		generator = class extends Generator {
			initializing() {
				packages.forEach(pkgPath => {
					return this.composeWith(require.resolve(pkgPath));
				});
			}
		};
	}
	env.registerStub(generator, generatorName);

	env.run(generatorName).on("end", () => {
		let configModule;
		try {
			const configPath = path.resolve(process.cwd(), ".yo-rc.json");
			configModule = require(configPath);
			// Change structure of the config to be transformed
			let tmpConfig = {};
			Object.keys(configModule).forEach(prop => {
				const configs = Object.keys(configModule[prop].configuration);
				configs.forEach(config => {
					tmpConfig[config] = configModule[prop].configuration[config];
				});
			});
			configModule = tmpConfig;
		} catch (err) {
			console.error(
				chalk.red("\nCould not find a yeoman configuration file.\n")
			);
			console.error(
				chalk.red(
					"\nPlease make sure to use 'this.config.set('configuration', this.configuration);' at the end of the generator.\n"
				)
			);
			Error.stackTraceLimit = 0;
			process.exitCode = -1;
		}
		const config = Object.assign(
			{
				configFile: !configPath ? null : fs.readFileSync(configPath, "utf8"),
				configPath: configPath
			},
			configModule
		);
		return runTransform(config, action);
	});
};
