const webpackConfigurationSchema = require("../config/webpackConfigurationSchema.json");
const validateSchema = require("webpack").validateSchema;

module.exports = function validateOptions(options) {
	let error;
	try {
		const errors = validateSchema(webpackConfigurationSchema, options);
		if (errors && errors.length > 0) {
			const { WebpackOptionsValidationError } = require("webpack");
			error = new WebpackOptionsValidationError(errors);
		}
	} catch (err) {
		error = err;
	}

	if (error) {
		console.error(error.message);
		process.exit(-1);
	}
};
