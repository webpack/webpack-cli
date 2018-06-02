const validateIdentifier = require("./validate-identifier");

/**
 *
 * Traverse safely over a path object for array for paths
 * @param {Object} obj - Object on which we traverse
 * @param {Array} paths - Array of strings containing the traversal path
 * @returns {Any} Value at given traversal path
 */
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

/**
 *
 * Traverse safely and return `type` for path object with value.value property
 * @param {Node} path - AST node
 * @returns {String|Boolean} type at given path.
 */
function safeTraverseAndGetType(path) {
	const pathValue = safeTraverse(path, ["value", "value"]);
	return pathValue ? pathValue.type : false;
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
 * It lookouts for the plugins property and, if the array is empty, it removes it from the AST
 * @param  {any} j - jscodeshift API
 * @param  {Node} rootNode - node to start search from
 * @returns {Node} rootNode modified AST.
 */

function findPluginsArrayAndRemoveIfEmpty(j, rootNode) {
	return rootNode.find(j.Identifier, { name: "plugins" }).forEach(node => {
		const elements = safeTraverse(node, [
			"parent",
			"value",
			"value",
			"elements"
		]);
		if (!elements.length) {
			j(node.parent).remove();
		}
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
			let regExpVal = val.__paths[0].value.program.body[0].expression;
			return j.literal(regExpVal.value);
		} else {
			// Use identifier instead
			if (
				!validateIdentifier.isKeyword(literalVal) ||
				!validateIdentifier.isIdentifierStart(literalVal) ||
				!validateIdentifier.isIdentifierChar(literalVal)
			)
				return j.identifier(literalVal);
		}
	}
	return j.literal(literalVal);
}

/**
 *
 * Adds or updates the value of a key within a root
 * webpack configuration property that's of type Object.
 *
 * @param {any} j — jscodeshift API
 * @param {Node} rootNode - node of root webpack configuration
 * @param {String} configProperty - key of an Object webpack configuration property
 * @param {String} key - key within the configuration object to update
 * @param {Object} value - the value to set for the key
 * @returns {Void}
 */

function addOrUpdateConfigObject(j, rootNode, configProperty, key, value) {
	const propertyExists = rootNode.properties.filter(
		node => node.key.name === configProperty
	).length;

	if (propertyExists) {
		rootNode.properties
			.filter(path => path.key.name === configProperty)
			.forEach(path => {
				const newProperties = path.value.properties.filter(
					path => path.key.name !== key
				);
				newProperties.push(j.objectProperty(j.identifier(key), value));
				path.value.properties = newProperties;
			});
	} else {
		rootNode.properties.push(
			j.objectProperty(
				j.identifier(configProperty),
				j.objectExpression([j.objectProperty(j.identifier(key), value)])
			)
		);
	}
}

/**
 *
 * Finds and removes a node for a given plugin name. If the plugin
 * is the last in the plugins array, the array is also removed.
 *
 * @param {any} j — jscodeshift API
 * @param {Node} node - node to start search from
 * @param {String} pluginName - name of the plugin to remove
 * @returns {Node | Void} - path to the root webpack configuration object if plugin is found
 */

function findAndRemovePluginByName(j, node, pluginName) {
	let rootPath;

	findPluginsByName(j, node, [pluginName])
		.filter(path => safeTraverse(path, ["parent", "value"]))
		.forEach(path => {
			rootPath = safeTraverse(path, ["parent", "parent", "parent", "value"]);
			const arrayPath = path.parent.value;
			if (arrayPath.elements && arrayPath.elements.length === 1) {
				j(path.parent.parent).remove();
			} else {
				j(path).remove();
			}
		});

	return rootPath;
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
 * @param {Node} path - AST node
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
 * Recursively adds an object/property to a node
 * @param {any} j — jscodeshift API
 * @param {Node} p - AST node
 * @param {String} key - key of a key/val object
 * @param {Any} value - Any type of object
 * @param {String} action - Action to be done on the given ast
 * @returns {Node} - the created ast
 */

function addProperty(j, p, key, value, action) {
	if (!p) {
		return;
	}
	let valForNode;
	if (Array.isArray(value)) {
		let arrExp = j.arrayExpression([]);
		if (
			safeTraverseAndGetType(p) === "ArrayExpression"
		) {
			arrExp = p.value.value;
		}
		value.forEach(val => {
			addProperty(j, arrExp, null, val);
		});
		valForNode = arrExp;
	} else if (
		typeof value === "object" &&
		!(value.__paths || value instanceof RegExp)
	) {
		let objectExp = j.objectExpression([]);
		if (
			safeTraverseAndGetType(p) === "ObjectExpression"
		) {
			objectExp = p.value.value;
		}
		// object -> loop through it
		Object.keys(value).forEach(prop => {
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

	// we only return the generated pushVal which will be replace the node path
	if (action === "add") return pushVal;

	if (p.properties) {
		p.properties.push(pushVal);
		return p;
	}
	if (p.value && p.value.properties) {
		p.value.properties.push(pushVal);
		return p;
	}
	if (p.elements) {
		p.elements.push(pushVal);
		return p;
	}
	return;
}

/**
 *
 * Get an property named topScope from yeoman and inject it to the top scope of
 * the config, outside module.exports
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} value - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

function parseTopScope(j, ast, value, action) {
	function createTopScopeProperty(p) {
		value.forEach(n => {
			if (
				!p.value.body[0].declarations ||
				n.indexOf(p.value.body[0].declarations[0].id.name) <= 0
			) {
				p.value.body.splice(-1, 0, n);
			}
		});
	}
	if (value) {
		return ast.find(j.Program).filter(p => createTopScopeProperty(p));
	} else {
		return ast;
	}
}

("use strict");

/**
 *
 * Transform for merge. Finds the merge property from yeoman and creates a way
 * for users to allow webpack-merge in their scaffold
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} value - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

function parseMerge(j, ast, value, action) {
	function createMergeProperty(p) {
		// FIXME Use j.callExp()
		let exportsDecl = p.value.body.map(n => {
			if (n.expression) {
				return n.expression.right;
			}
		});
		const bodyLength = exportsDecl.length;
		let newVal = {};
		newVal.type = "ExpressionStatement";
		newVal.expression = {
			type: "AssignmentExpression",
			operator: "=",
			left: {
				type: "MemberExpression",
				computed: false,
				object: j.identifier("module"),
				property: j.identifier("exports")
			},
			right: j.callExpression(j.identifier("merge"), [
				j.identifier(value),
				exportsDecl.pop()
			])
		};
		p.value.body[bodyLength - 1] = newVal;
	}
	if (value) {
		return ast.find(j.Program).filter(p => createMergeProperty(p));
	} else {
		return ast;
	}
}

module.exports = {
	safeTraverse,
	safeTraverseAndGetType,
	createProperty,
	findPluginsByName,
	findRootNodesByName,
	addOrUpdateConfigObject,
	findAndRemovePluginByName,
	createOrUpdatePluginByName,
	findVariableToPlugin,
	findPluginsArrayAndRemoveIfEmpty,
	isType,
	createLiteral,
	createIdentifierOrLiteral,
	findObjWithOneOfKeys,
	getRequire,
	addProperty,
	parseTopScope,
	parseMerge
};
