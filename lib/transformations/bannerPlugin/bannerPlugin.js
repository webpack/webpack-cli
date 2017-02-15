const utils = require('../utils');

module.exports = function(j, ast) {
	const loaderOptions = {};

	utils.findPluginsByName(j, ast, ['webpack.BannerPlugin'])
		.forEach(path => {
			const args = path.value.arguments;
			// If the first argument is a literal
			// replace it with object notation
			// See https://webpack.js.org/guides/migrating/#bannerplugin-breaking-change
			if (args && args.length > 1 && args[0].type === j.Literal.name) {
				loaderOptions.banner = args[0].value;
				// and remove the first argument
				path.value.arguments = [path.value.arguments[1]];
			}
		});

	return utils.findPluginsRootNodes(j, ast)
		.forEach(path => {
			utils.createOrUpdatePluginByName(j, path, 'webpack.BannerPlugin', loaderOptions);
		})
		.toSource({ quote: 'single' });
};
