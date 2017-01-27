module.exports = function(j, ast) {

	function createSourceMapsProperty() {
		return j.property('init', j.identifier('sourceMap'), j.identifier('true'));
	}

	return ast
		.find(j.NewExpression)
		.filter(path => path.get('callee').value.property.name === 'UglifyJsPlugin')
		.forEach(path => {
			const args = path.value.arguments;

			if (args.length) {
				// Plugin is called with object as arguments
				j(path)
					.find(j.ObjectExpression)
					.get('properties')
					.value
					.push(createSourceMapsProperty());
			} else {
				// Plugin is called without arguments
				args.push(j.objectExpression([createSourceMapsProperty()]));
			}
		})
		.toSource({ quote: 'single' });
};
