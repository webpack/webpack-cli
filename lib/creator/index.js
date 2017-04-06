"use strict";

const validateSchema = require("./utils/validateSchema.js");
const webpackOptionsSchema = require("./utils/webpackOptionsSchema.json");
const WebpackOptionsValidationError = require("./utils/WebpackOptionsValidationError");
const initTransform = require("./init-transform");
const chalk = require("chalk");
/*
 * @function creator
 *
 * Main function to build up a webpack configuration.
 * Either throws an error if it doesn't match the webpack schema,
 * or validates the filepaths of the options given.
 * If a package is supplied, it finds the path of the package and runs inquirer
 *
 * @param { Array } pkgPaths - An Array of packages to run
 * @param { <object|null> } opts - An object containing webpackOptions or nothing
 * @returns { <Function|Error> } initTransform - Initializes the scaffold in yeoman
 */

module.exports = function creator(pkgPaths, opts) {
	// null, config -> without package
	// addon, null -> with package
	// we're dealing with init, we need to change this later, as it may have been emptied by yeoman
	if(!pkgPaths && !opts) {
		initTransform();
	} else if(pkgPaths) {
		// this example app actually needs a refactor in order for it to work
		initTransform(pkgPaths);
	} else if(!pkgPaths && opts) {
		console.log(opts);
		// scaffold is done
		/*
		const webpackOptionsValidationErrors = validateSchema(webpackOptionsSchema, initialWebpackConfig);
		if (webpackOptionsValidationErrors.length) {
			throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
		} else {
			process.stdout.write('\n' + chalk.green('Congratulations! Your new webpack config file is created!') + '\n');
		}
		*/
	}
};
