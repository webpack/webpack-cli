function safeTraverse(obj, paths) {
	let val = obj;
	let idx = 0;

	while (idx < paths.length) {
		if (!val) {
			return null;
		}
		val = val[paths[idx]];
		idx++;
	}
	return val;
}

// Convert nested MemberExpressions to strings like webpack.optimize.DedupePlugin
function memberExpressionToPathString(path) {
	if (path && path.object) {
		return [memberExpressionToPathString(path.object), path.property.name].join('.');
	}
	return path.name;
}

// Return paths that match `new name.space.PluginName()`
// for a given array of plugin names
function findPluginsByName(j, node, pluginNamesArray) {
	return node
		.find(j.NewExpression)
		.filter(path => {
			return pluginNamesArray.some(
				plugin => memberExpressionToPathString(path.get('callee').value) === plugin
			);
		});
}

module.exports = {
	safeTraverse,
	memberExpressionToPathString,
	findPluginsByName
};
