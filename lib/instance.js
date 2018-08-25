const webpack = require("webpack");

module.exports = function webpackInstance(result, options) {
	const { webpackOptions, processingErrors } = result;
	if (webpackOptions.help) {
		console.error(webpackOptions.help);
		return;
	}
	if (processingErrors.length > 0) {
		throw new Error(result.processingErrors);
	}

	process.exit(0);
	const compiler = webpack(options);
	compiler.run(() => {});
	return null;
};
