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
		return [memberExpressionToPathString(path.object), path.property.name].join(
			"."
		);
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

/**
 *
 * Find paths that match `new name.space.PluginName()` for a
 * given array of plugin names
 *
 * @param {any} j — jscodeshift API
 * @param {Node} node - Node to start search from
 * @param {String[]} pluginNamesArray - Array of plugin names like `webpack.LoaderOptionsPlugin`
 * @returns {Node} Node that has the pluginName
 */

function findPluginsByName(j, node, pluginNamesArray) {
	return node.find(j.NewExpression).filter(path => {
		return pluginNamesArray.some(
			plugin =>
				memberExpressionToPathString(path.get("callee").value) === plugin
		);
	});
}

/**
 *
 * Finds the path to the `name: []` node
 *
 * @param {any} j — jscodeshift API
 * @param {Node} node - Node to start search from
 * @param {String} propName - property to search for
 * @returns {Node} found node and
 */

function findRootNodesByName(j, node, propName) {
	return node.find(j.Property, { key: { name: propName } });
}

/**
 *
 * Creates an Object's property with a given key and value
 *
 * @param {any} j — jscodeshift API
 * @param {String | Number} key - Property key
 * @param {String | Number | Boolean} value - Property value
 * @returns {Node}
 */

function createProperty(j, key, value) {
	return j.property(
		"init",
		createIdentifierOrLiteral(j, key),
		createLiteral(j, value)
	);
}

/**
 *
 * Creates an appropriate literal property
 *
 * @param {any} j — jscodeshift API
 * @param {String | Boolean | Number} val
 * @returns {Node}
 */

function createLiteral(j, val) {
	let literalVal = val;
	// We'll need String to native type conversions
	if (typeof val === "string") {
		// 'true' => true
		if (val === "true") literalVal = true;
		// 'false' => false
		if (val === "false") literalVal = false;
		// '1' => 1
		if (!isNaN(Number(val))) literalVal = Number(val);
	}
	return j.literal(literalVal);
}

/**
 *
 * Creates an appropriate identifier or literal property
 *
 * @param {any} j — jscodeshift API
 * @param {String | Boolean | Number} val
 * @returns {Node}
 */

function createIdentifierOrLiteral(j, val) {
	// IPath<IIdentifier> | IPath<ILiteral> doesn't work, find another way
	let literalVal = val;
	// We'll need String to native type conversions
	if (typeof val === "string" || val.__paths) {
		// 'true' => true
		if (val === "true") {
			literalVal = true;
			return j.literal(literalVal);
		}
		// 'false' => false
		if (val === "false") {
			literalVal = false;
			return j.literal(literalVal);
		}
		// '1' => 1
		if (!isNaN(Number(val))) {
			literalVal = Number(val);
			return j.literal(literalVal);
		}

		if (val.__paths) {
			return createExternalRegExp(j, val);
		} else {
			// Use identifier instead
			// TODO: Check if literalVal is a valid Identifier!
			return j.identifier(literalVal);
		}
	}
	return j.literal(literalVal);
}

/**
 *
 * Finds or creates a node for a given plugin name string with options object
 * If plugin declaration already exist, options are merged.
 *
 * @param {any} j — jscodeshift API
 * @param {Node} rootNodePath - `plugins: []` NodePath where plugin should be added. See https://github.com/facebook/jscodeshift/wiki/jscodeshift-Documentation#nodepaths
 * @param {String} pluginName - ex. `webpack.LoaderOptionsPlugin`
 * @param {Object} options - plugin options
 * @returns {Void}
 */

function createOrUpdatePluginByName(j, rootNodePath, pluginName, options) {
	const pluginInstancePath = findPluginsByName(j, j(rootNodePath), [
		pluginName
	]);
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
						.get("properties");

					optionsProps.forEach(opt => {
						// Search for same keys in the existing object
						const existingProps = j(currentProps)
							.find(j.Identifier)
							.filter(path => opt.key.value === path.value.name);

						if (existingProps.size()) {
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
					args.push(j.objectExpression(optionsProps));
				}
			}
		});
	} else {
		let argumentsArray = [];
		if (optionsProps) {
			argumentsArray = [j.objectExpression(optionsProps)];
		}
		const loaderPluginInstance = j.newExpression(
			pathsToMemberExpression(j, pluginName.split(".").reverse()),
			argumentsArray
		);
		rootNodePath.value.elements.push(loaderPluginInstance);
	}
}

/**
 *
 * Finds the variable to which a third party plugin is assigned to
 *
 * @param {any} j — jscodeshift API
 * @param {Node} rootNode - `plugins: []` Root Node. See https://github.com/facebook/jscodeshift/wiki/jscodeshift-Documentation#nodepaths
 * @param {String} pluginPackageName - ex. `extract-text-plugin`
 * @returns {String} variable name - ex. 'const s = require(s) gives "s"`
 */

function findVariableToPlugin(j, rootNode, pluginPackageName) {
	const moduleVarNames = rootNode
		.find(j.VariableDeclarator)
		.filter(j.filters.VariableDeclarator.requiresModule(pluginPackageName))
		.nodes();
	if (moduleVarNames.length === 0) return null;
	return moduleVarNames.pop().id.name;
}

/**
 *
 * Returns true if type is given type
 * @param {Node} path - pathNode
 * @param {String} type - node type
 * @returns {Boolean}
 */

function isType(path, type) {
	return path.type === type;
}

function findObjWithOneOfKeys(p, keyNames) {
	return p.value.properties.reduce((predicate, prop) => {
		const name = prop.key.name;
		return keyNames.indexOf(name) > -1 || predicate;
	}, false);
}

/**
 *
 * Returns constructed require symbol
 * @param {any} j — jscodeshift API
 * @param {String} constName - Name of require
 * @param {String} packagePath - path of required package
 * @returns {Node} - the created ast
 */

function getRequire(j, constName, packagePath) {
	return j.variableDeclaration("const", [
		j.variableDeclarator(
			j.identifier(constName),
			j.callExpression(j.identifier("require"), [j.literal(packagePath)])
		)
	]);
}

/**
 *
 * Creates an empty array
 * @param {any} j — jscodeshift API
 * @param {String} key - array name
 * @returns {Array} arr - An empty array
 */
function createEmptyArrayProperty(j, key) {
	return j.property("init", j.identifier(key), j.arrayExpression([]));
}

/**
 *
 * Creates an array and iterates on an object with properties
 *
 * @param {any} j — jscodeshift API
 * @param {String} key - object name
 * @param {String} subProps - computed value of the property
 * @param {Boolean} shouldDropKeys - bool to ask to use obj.keys or not
 * @returns {Array} arr - An array with the object properties
 */

function createArrayWithChildren(j, values) {
	let arr = j.arrayExpression([]);
	values.forEach(prop => {
		return arr.elements.push(j(prop).toSource());
	});
	return arr;
}

/**
 *
 * Finds a regexp property with an already parsed AST from the user
 * @param {any} j — jscodeshift API
 * @param {String} prop - property to find the value at
 * @returns {Node} - A literal node with the found regexp
 */

function createExternalRegExp(j, prop) {
	let regExpProp = prop.__paths[0].value.program.body[0].expression;
	console.log(regExpProp.value)
	return j.literal(regExpProp.value);
}

/**
 *
 * @param {any} j — jscodeshift API
 * @param {Node} p - path to push
 * @param {Object} webpackProperties - The object to loop over
 * @param {String} name - Key that will be the identifier we find and add values to
 * @returns {Node | Function} Returns a function that will push a node if
 * subProperty is an array, else it will invoke a function that will push a single node
 */

function pushObjectKeys(j, p, values) {
	let objExp = j.objectExpression([]);
	Object.keys(values).forEach(prop => {
		addProperty(j, objExp, prop, values[prop]);
	});
	return objExp;
}

function addProperty(j, p, key, value) {
	let valForNode;
	if(!p) {
		return;
	}
	if (Array.isArray(value)) {
		const arr = j.arrayExpression([]);
		value.filter(val => val).forEach( val => {
			arr.elements.push(addProperty(j, arr, null, val));
		})
		valForNode = arr;
	} else if (typeof value === "object") {
		// object -> loop through it
		let objectExp = j.objectExpression([]);
		Object.keys(value).filter(prop => value[prop]).forEach(prop => {
			addProperty(j, objectExp, prop, value[prop]);
		});
		valForNode = objectExp;
	} else {
		valForNode = createIdentifierOrLiteral(j, value);
	}
	let pushVal;
	if (key) {
		 pushVal = j.property("init", j.identifier(key), valForNode);
	} else {
		pushVal = valForNode;
	}
	if(p.properties) {
		p.properties.push(pushVal);
		return p;
	}
	if(p.value && p.value.properties) {
		p.value.properties.push(pushVal);
		return p;
	}
	if(p.elements) {
		p.elements.push(pushVal);
		return;
	}
	console.log(p)
	return;
}
module.exports = {
	safeTraverse,
	createProperty,
	findPluginsByName,
	findRootNodesByName,
	createOrUpdatePluginByName,
	findVariableToPlugin,
	isType,
	createLiteral,
	createIdentifierOrLiteral,
	findObjWithOneOfKeys,
	getRequire,
	createArrayWithChildren,
	createEmptyArrayProperty,
	createExternalRegExp,
	pushObjectKeys,
	addProperty
};
