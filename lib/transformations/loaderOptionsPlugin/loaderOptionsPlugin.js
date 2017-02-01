const findPluginsByName = require('../utils').findPluginsByName;

module.exports = function(j, ast) {

	function createProperty(key, value) {
		return j.property(
			'init',
			j.identifier(key),
			typeof value === 'string' ? j.identifier(value) : j.literal(value)
		);
	}

	return findPluginsByName(j, ast, ['webpack.optimize.UglifyJsPlugin'])
		.forEach(path => {
			const pluginsPath = path.parent;
			const loaderPluginPaths = findPluginsByName(j,
				j(pluginsPath),
				['webpack.optimize.LoaderOptionsPlugin']);

			// If LoaderOptionsPlugin declaration exist
			if (loaderPluginPaths.size()) {
				loaderPluginPaths.forEach(path => {
					const args = path.value.arguments;
					if (args.length) {
						// Plugin is called with object as arguments
						j(path)
							.find(j.ObjectExpression)
							.get('properties')
							.value
							.push(createProperty('minimize', true));
					} else {
						// Plugin is called without arguments
						args.push(
							j.objectExpression([createProperty('minimize', true)])
						);
					}
				});
			} else {
				const loaderPluginInstance = j.newExpression(
					j.memberExpression(
						j.memberExpression(
							j.identifier('webpack'),
							j.identifier('optimize')
						), j.identifier('LoaderOptionsPlugin')
					), [
						j.objectExpression([createProperty('minimize', true)])
					]
				);
				pluginsPath.value.elements.push(loaderPluginInstance);
			}
		})
		.toSource({ quote: 'single' });
};
