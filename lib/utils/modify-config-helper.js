"use strict";

const fs = require("fs");
const path = require("path");
const yeoman = require("yeoman-environment");
const runTransform = require("../init/transformations/index");
const Generator = require("yeoman-generator");
/**
 *
 * Looks up the webpack.config in the user's path and runs a given
 * generator scaffold followed up by a transform
 *
 * @param {String} action — action to be done (add, remove, update, init)
 * @param {Class} name - Name for the given function
 * @returns {Function} runTransform - Returns a transformation instance
 */

module.exports = function modifyHelperUtil(action, generator, packages) {
	let configPath = path.resolve(process.cwd(), "webpack.config.js");
	const webpackConfigExists = fs.existsSync(configPath);
	if (!webpackConfigExists) {
		configPath = null;
	}
	const env = yeoman.createEnv("webpack", null);
	const generatorName = `webpack-${action}-generator`;

	if(!generator) {
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
			const configPath = path.resolve(process.cwd(), '.yo-rc.json')
			configModule = require(configPath)['webpack-cli'].webpackOptions
		} catch (err) {
			configModule = null;
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
