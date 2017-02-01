module.exports = function(j, ast) {
	// List of deprecated plugins to remove
	// each item refers to webpack.optimize.[NAME] construct
	const deprecatedPlugingsList = [
		'webpack.optimize.OccurrenceOrderPlugin',
		'webpack.optimize.DedupePlugin'
	];

	// Convert nested MemberExpressions to strings like webpack.optimize.DedupePlugin
	function memberToString(path) {
		if (path && path.object) {
			return [memberToString(path.object), path.property.name].join('.');
		}
		return path.name;
	}

	return ast
		.find(j.NewExpression)
		.filter(path => {
			return deprecatedPlugingsList.some(
				plugin => memberToString(path.get('callee').value) === plugin
			);
		})
		.forEach(path => {
			// Check how many plugins are defined and
			// if there is only last plugin left remove `plugins: []` completely
			if (path.parent.value.elements.length === 1) {
				j(path.parent.parent).remove();
			} else {
				j(path).remove();
			}
		})
		.toSource({ quote: 'single' });
};
