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

// Convert Array<string> like ['webpack', 'optimize', 'DedupePlugin'] to nested MemberExpressions
function pathsToMemberExpression(j, paths) {
	if (!paths.length) {
		return null;
	} else if (paths.length === 1) {
		return j.identifier(paths[0]);
	} else {
		const first = paths.slice(0, 1);
		const rest = paths.slice(1);
		return j.memberExpression(
			pathsToMemberExpression(j, rest),
			pathsToMemberExpression(j, first)
		);
	}
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

/*
 * @function findPluginsRootNodes
 *
 * Finds the path to the `plugins: []` node
 *
 * @param j — jscodeshift API
 * @param { Node } node - Node to start search from
 * @returns Path
 * */
function findPluginsRootNodes(j, node) {
	return node
		.find(j.Property, { key: { name: 'plugins' } })
		.map(path => path);
}

/*
 * @function createProperty
 *
 * Creates an Object's property with a given value
 *
 * @param j — jscodeshift API
 * @param { string } key - Property key
 * @param { string | number | boolean } value - Property value
 * @returns Node
 * */
function createProperty(j, key, value) {
	return j.property(
		'init',
		j.identifier(key),
		typeof value === 'string' ? j.identifier(value) : j.literal(value)
	);
}

/*
 * @function createOrUpdatePluginByName
 *
 * Findes or creates a node for a given plugin name string with options object
 * If plugin decalaration already exist, options are merged.
 *
 * @param j — jscodeshift API
 * @param { NodePath } rooNodePath - `plugins: []` NodePath where plugin should be added. See https://github.com/facebook/jscodeshift/wiki/jscodeshift-Documentation#nodepaths
 * @param { string } pluginName - ex. `webpack.optimize.LoaderOptionsPlugin`
 * @param { Object } options - plugin options
 * @returns void
 * */
function createOrUpdatePluginByName(j, rootNodePath, pluginName, options) {
	const pluginInstancePath = findPluginsByName(j, j(rootNodePath), [pluginName]);
	let optionsProps;
	if (options) {
		optionsProps = Object.keys(options).map(key => {
			return createProperty(j, key, options[key]);
		});
	}

	// If plugin declaration already exist
	if (pluginInstancePath.size()) {
		pluginInstancePath.forEach(path => {
			// There are options we want to pass as argument
			if (optionsProps) {
				const args = path.value.arguments;
				if (args.length) {
					// Plugin is called with object as arguments
					// we will merge those objects
					let currentProps = j(path)
						.find(j.ObjectExpression)
						.get('properties');

					optionsProps.forEach(opt => {
						// Search for same keys in the existing object
						const currentOptName = opt.key.name;
						j(currentProps)
							.find(j.Identifier)
							.forEach(path => {
								if (path.value.name === currentOptName) {
									// Merging values for same key
									j(path.parent).replaceWith(opt);
								} else {
									// Adding new key:values
									currentProps.value.push(opt);
								}
							});
					});

				} else {
					// Plugin is called without arguments
					args.push(
						j.objectExpression(optionsProps)
					);
				}
			}
		});
	} else {
		let argumentsArray = [];
		if (optionsProps) {
			argumentsArray = [j.objectExpression(optionsProps)];
		}
		const loaderPluginInstance = j.newExpression(
			pathsToMemberExpression(j, pluginName.split('.').reverse()),
			argumentsArray
		);
		rootNodePath.value.elements.push(loaderPluginInstance);
	}
}

module.exports = {
	safeTraverse,
	findPluginsByName,
	findPluginsRootNodes,
	createOrUpdatePluginByName
};
