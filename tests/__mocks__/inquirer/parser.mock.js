/* eslint-disable */
const resolveTransform = require('../../../lib/parser/resolve-transform');
const validateOptions = require('../../../lib/parser/validateOptions');
const validateSchema = require('../../../lib/parser/utils/validateSchema.js');
const webpackOptionsSchema = require('../../../lib/parser/utils/webpackOptionsSchema.json');
const WebpackOptionsValidationError = require('../../../lib/parser/utils/WebpackOptionsValidationError');

module.exports = function parser(pkg,opts) {
	if(opts) {
		const webpackOptionsValidationErrors = validateSchema(webpackOptionsSchema, opts);
		if(webpackOptionsValidationErrors.length) {
			let err = new WebpackOptionsValidationError(webpackOptionsValidationErrors);
			return err;
		}
		//validateOptions(opts);
	} else {
		resolveTransform(pkg);
	}
};
