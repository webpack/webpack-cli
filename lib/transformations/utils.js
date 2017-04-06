function safeTraverse(obj, paths) {
	let val = obj;
	let idx = 0;

	while(idx < paths.length) {
		if(!val) {
			return null;
		}
		val = val[paths[idx]];
		idx++;
	}
	return val;
}

// Convert nested MemberExpressions to strings like webpack.optimize.DedupePlugin
function memberExpressionToPathString(path) {
	if(path && path.object) {
		return [memberExpressionToPathString(path.object), path.property.name].join(".");
	}
	return path.name;
}

// Convert Array<string> like ['webpack', 'optimize', 'DedupePlugin'] to nested MemberExpressions
function pathsToMemberExpression(j, paths) {
	if(!paths.length) {
		return null;
	} else if(paths.length === 1) {
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

/*
 * @function findPluginsByName
 *
 * Find paths that match `new name.space.PluginName()` for a given array of plugin names
 *
 * @param j — jscodeshift API
 * @param { Node } node - Node to start search from
 * @param { Array<String> } pluginNamesArray - Array of plugin names like `webpack.optimize.LoaderOptionsPlugin`
 * @returns Path
 * */
function findPluginsByName(j, node, pluginNamesArray) {
	return node
		.find(j.NewExpression)
		.filter(path => {
			return pluginNamesArray.some(
				plugin => memberExpressionToPathString(path.get("callee").value) === plugin
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
	return node.find(j.Property, {
		key: {
			name: "plugins"
		}
	});
}

/*
 * @function createProperty
 *
 * Creates an Object's property with a given key and value
 *
 * @param j — jscodeshift API
 * @param { string | number } key - Property key
 * @param { string | number | boolean } value - Property value
 * @returns Node
 * */
function createProperty(j, key, value) {
	return j.property(
		"init",
		createLiteral(j, key),
		createLiteral(j, value)
	);
}

/*
 * @function createLiteral
 *
 * Creates an appropriate literal property
 *
 * @param j — jscodeshift API
 * @param { string | boolean | number } val
 * @returns { Node }
 * */

function createLiteral(j, val) {
	let literalVal = val;
	// We'll need String to native type conversions
	if(typeof val === "string") {
		// 'true' => true
		if(val === "true") literalVal = true;
		// 'false' => false
		if(val === "false") literalVal = false;
		// '1' => 1
		if(!isNaN(Number(val))) literalVal = Number(val);
	}
	return j.literal(literalVal);
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
	if(options) {
		optionsProps = Object.keys(options).map(key => {
			return createProperty(j, key, options[key]);
		});
	}

	// If plugin declaration already exist
	if(pluginInstancePath.size()) {
		pluginInstancePath.forEach(path => {
			// There are options we want to pass as argument
			if(optionsProps) {
				const args = path.value.arguments;
				if(args.length) {
					// Plugin is called with object as arguments
					// we will merge those objects
					let currentProps = j(path)
						.find(j.ObjectExpression)
						.get("properties");

					optionsProps.forEach(opt => {
						// Search for same keys in the existing object
						const existingProps = j(currentProps)
							.find(j.Identifier)
							.filter(path => opt.key.value === path.value.name);

						if(existingProps.size()) {
							// Replacing values for the same key
							existingProps.forEach(path => {
								j(path.parent).replaceWith(opt);
							});
						} else {
							// Adding new key:values
							currentProps.value.push(opt);
						}
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
		if(optionsProps) {
			argumentsArray = [j.objectExpression(optionsProps)];
		}
		const loaderPluginInstance = j.newExpression(
			pathsToMemberExpression(j, pluginName.split(".").reverse()),
			argumentsArray
		);
		rootNodePath.value.elements.push(loaderPluginInstance);
	}
}

/*
 * @function findVariableToPlugin
 *
 * Finds the variable to which a third party plugin is assigned to
 *
 * @param j — jscodeshift API
 * @param { Node } rootNode - `plugins: []` Root Node. See https://github.com/facebook/jscodeshift/wiki/jscodeshift-Documentation#nodepaths
 * @param { string } pluginPackageName - ex. `extract-text-plugin`
 * @returns { string } variable name - ex. 'var s = require(s) gives "s"`
 * */

function findVariableToPlugin(j, rootNode, pluginPackageName) {
	const moduleVarNames = rootNode.find(j.VariableDeclarator)
		.filter(j.filters.VariableDeclarator.requiresModule(pluginPackageName))
		.nodes();
	if(moduleVarNames.length === 0) return null;
	return moduleVarNames.pop().id.name;
}

/*
 * @function isType
 *
 * Returns true if type is given type
 * @param { Node} path - pathNode
 * @param { string } type - node type
 * @returns {boolean}
 */

function isType(path, type) {
	return path.type === type;
}

function findObjWithOneOfKeys(p, keyNames) {
	return p.value.properties
		.reduce((predicate, prop) => {
			const name = prop.key.name;
			return keyNames.indexOf(name) > -1 ||
				predicate;
		}, false);
}

/*
 * @function getRequire
 *
 * Returns constructed require symbol
 * @param j — jscodeshift API
 * @param { string } constName - Name of require
 * @param { string } packagePath - path of required package
 * @returns {NodePath} - the created ast
 */

function getRequire(j, constName, packagePath) {
	return j.variableDeclaration("const", [
		j.variableDeclarator(
			j.identifier(constName),
			j.callExpression(
				j.identifier("require"), [j.literal(packagePath)]
			)
		)
	]);
}

module.exports = {
	safeTraverse,
	createProperty,
	findPluginsByName,
	findPluginsRootNodes,
	createOrUpdatePluginByName,
	findVariableToPlugin,
	isType,
	createLiteral,
	findObjWithOneOfKeys,
	getRequire
};
