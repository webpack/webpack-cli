const resolveTransform = require('./resolve-transform');
const validateOptions = require('./validateOptions');
const validateSchema = require('./utils/validateSchema.js');
const webpackOptionsSchema = require('./utils/webpackOptionsSchema.json');
const WebpackOptionsValidationError = require('./utils/WebpackOptionsValidationError');

module.exports = function parser(pkg,opts) {
	// null, config -> without package
	// addon, null -> with package

	if(opts) {
		//FIXME: Ongoing work here, need to think about execution context to preserve perf and error logging
		const webpackOptionsValidationErrors = validateSchema(webpackOptionsSchema, opts);
		if(webpackOptionsValidationErrors.length) {
			throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
		}
		validateOptions(opts);
	} else {
		resolveTransform(pkg);
	}
};
