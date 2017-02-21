const resolveDependency = require('./resolve-dependency');
const validateOptions = require('./validate-options');
const validateSchema = require('./utils/validateSchema.js');
const webpackOptionsSchema = require('./utils/webpackOptionsSchema.json');
const WebpackOptionsValidationError = require('./utils/WebpackOptionsValidationError');
const initTransform = require('./init-transform');
/*
* @function parser
*
* Main function to build up a webpack configuration.
* Either throws an error if it doesn't match the webpack schema,
* or validates the filepaths of the options given.
* If a package is supplied, it finds the package and runs inquirer
*
* TODO: This is going to be changed, as we need to build up transformation rules,
* and then check with validation. We should also make sure @validateOptions
* aren't being run for every object, as some objects in webpackOptions aren't filepaths.
*
* @param { Array } pkg - A package to be checked
* @param { <object|null> } opts - An object containing webpackOptions or nothing
* @returns { <Function|Error> } validateOptions|resolveDependency -
* Reruns inquirer or validates the given option paths if it matches the schema
*/

module.exports = function parser(pkg,opts) {
	// null, config -> without package
	// addon, null -> with package
	if(opts) {
		let initialWebpackConfig;
		initTransform(opts);
		/*
		const webpackOptionsValidationErrors = validateSchema(webpackOptionsSchema, opts);
		if(webpackOptionsValidationErrors.length) {
			throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
		}
		*/

	} else {
		resolveDependency(pkg);
	}
};
