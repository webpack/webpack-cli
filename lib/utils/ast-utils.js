const hashtable = require("./hashtable");
const validateIdentifier = require("./validate-identifier");

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
			if (!validateIdentifier.isKeyword(literalVal) || !validateIdentifier.isIdentifierStart(literalVal) || !validateIdentifier.isIdentifierChar(literalVal))
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
 * If a prop exists, it overrides it, else it creates a new one
 * @param {any} j — jscodeshift API
 * @param {Node} node - objectexpression to check
 * @param {String} key - Key of the property
 * @param {String} value - computed value of the property
 * @returns {Void}
 */

function checkIfExistsAndAddValue(j, node, key, value) {
	const existingProp = node.value.properties.filter(
		prop => prop.key.name === key
	);
	let prop;
	if (existingProp.length > 0) {
		prop = existingProp[0];
		prop.value = value;
	} else {
		prop = j.property("init", j.identifier(key), value);
		node.value.properties.push(prop);
	}
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

function createArrayWithChildren(j, key, subProps, shouldDropKeys) {
	let arr = createEmptyArrayProperty(j, key);
	if (shouldDropKeys) {
		subProps.forEach(subProperty => {
			let objectOfArray = j.objectExpression([]);
			if (typeof subProperty !== "string") {
				loopThroughObjects(j, objectOfArray, subProperty);
				arr.value.elements.push(objectOfArray);
			} else {
				return arr.value.elements.push(
					createIdentifierOrLiteral(j, subProperty)
				);
			}
		});
	} else {
		Object.keys(subProps[key]).forEach(subProperty => {
			arr.value.elements.push(
				createIdentifierOrLiteral(j, subProps[key][subProperty])
			);
		});
	}
	return arr;
}

/**
 *
 * Loops through an object and adds property to an object with no identifier
 * @param {any} j — jscodeshift API
 * @param {Node} p - node to add value to
 * @param {Object} obj - Object to loop through
 * @returns {Function | Node} - Either pushes the node, or reruns until
 * nothing is left
 */

function loopThroughObjects(j, p, obj) {
	Object.keys(obj).forEach(prop => {
		if (prop.indexOf("inject") >= 0) {
			// TODO to insert the type of node, identifier or literal
			const propertyExpression = createIdentifierOrLiteral(j, obj[prop]);
			return p.properties.push(propertyExpression);
		}
		// eslint-disable-next-line no-irregular-whitespace
		if (typeof obj[prop] !== "object" || obj[prop] instanceof RegExp) {
			p.properties.push(
				createObjectWithSuppliedProperty(
					j,
					prop,
					createIdentifierOrLiteral(j, obj[prop])
				)
			);
		} else if (Array.isArray(obj[prop])) {
			let arrayProp = createArrayWithChildren(j, prop, obj[prop], true);
			p.properties.push(arrayProp);
		} else {
			let objectBlock = j.objectExpression([]);
			let propertyOfBlock = createObjectWithSuppliedProperty(
				j,
				prop,
				objectBlock
			);
			loopThroughObjects(j, objectBlock, obj[prop]);
			p.properties.push(propertyOfBlock);
		}
	});
}

/**
 *
 * Creates an object with an supplied property as parameter
 *
 * @param {any} j — jscodeshift API
 * @param {String} key - object name
 * @param {Node} prop - property to be added
 * @returns {Node} - An property with the supplied property
 */

function createObjectWithSuppliedProperty(j, key, prop) {
	return j.property("init", j.identifier(key), prop);
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
	return j.literal(regExpProp.value);
}

/**
 *
 * Creates a property and pushes the value to a node
 *
 * @param {any} j — jscodeshift API
 * @param {Node} p - Node to push against
 * @param {String} key - key used as identifier
 * @param {String} val - property value
 * @returns {Node} - Returns node the pushed property
 */

function pushCreateProperty(j, p, key, val) {
	let property;
	const findProp = findRootNodesByName(j, j(p), key);
	if (findProp.size()) {
		findProp.filter(p => {
			p.value.value = createIdentifierOrLiteral(j, val);
		});
	} else {
		if (val.hasOwnProperty("type")) {
			property = val;
		} else {
			property = createIdentifierOrLiteral(j, val);
		}
		return p.value.properties.push(
			createObjectWithSuppliedProperty(j, key, property)
		);
	}
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

function pushObjectKeys(j, p, webpackProperties, name, reassign) {
	p.value.properties
		.filter(n => safeTraverse(n, ["key", "name"]) === name)
		.forEach(prop => {
			Object.keys(webpackProperties).forEach(webpackProp => {
				try {
					webpackProperties[webpackProp] = JSON.parse(
						webpackProperties[webpackProp]
					);
				} catch (err) {}

				if (webpackProp.indexOf("inject") >= 0) {
					if (reassign) {
						return checkIfExistsAndAddValue(
							j,
							prop,
							webpackProp,
							webpackProperties[webpackProp]
						);
					} else {
						return prop.value.properties.push(
							createIdentifierOrLiteral(j, webpackProperties[webpackProp])
						);
					}
				} else if (Array.isArray(webpackProperties[webpackProp])) {
					if (reassign) {
						return j(p)
							.find(j.Property, { key: { name: webpackProp } })
							.filter(props => props.value.key.name === webpackProp)
							.forEach(property => {
								let markedProps = [];
								let propsToMerge = [];
								property.value.value.elements.forEach(elem => {
									if (elem.value) {
										markedProps.push(elem.value);
									}
								});
								webpackProperties[webpackProp].forEach(underlyingprop => {
									if (typeof underlyingprop === "object") {
										//TODO loaders
										return;
									}
									if (!markedProps.includes(underlyingprop)) {
										propsToMerge.push(underlyingprop);
									}
								});
								const hashtableForProps = hashtable(propsToMerge);
								hashtableForProps.forEach(elem => {
									property.value.value.elements.push(
										createIdentifierOrLiteral(j, elem)
									);
								});
							});
					} else {
						const propArray = createArrayWithChildren(
							j,
							webpackProp,
							webpackProperties[webpackProp],
							true
						);
						return prop.value.properties.push(propArray);
					}
				} else if (
					typeof webpackProperties[webpackProp] !== "object" ||
					webpackProperties[webpackProp].__paths ||
					webpackProperties[webpackProp] instanceof RegExp
				) {
					return pushCreateProperty(
						j,
						prop,
						webpackProp,
						webpackProperties[webpackProp]
					);
				} else {
					if (!reassign) {
						pushCreateProperty(j, prop, webpackProp, j.objectExpression([]));
					}
					return pushObjectKeys(
						j,
						prop,
						webpackProperties[webpackProp],
						webpackProp,
						reassign
					);
				}
			});
		});
}

/**
 *
 * Checks if we are at the correct node and later invokes a callback
 * for the transforms to either use their own transform function or
 * use pushCreateProperty if the transform doesn't expect any properties
 *
 * @param {any} j — jscodeshift API
 * @param {Node} p - Node to push against
 * @param {Function} cb - callback to be invoked
 * @param {String} identifier - key to use as property
 * @param {Object} property - WebpackOptions that later will be converted via
 * pushCreateProperty via WebpackOptions[identifier]
 * @returns {Function} cb - Returns the callback and pushes a new node
 */

function isAssignment(j, p, cb, identifier, property) {
	if (p.parent.value.type === "AssignmentExpression") {
		if (j) {
			return cb(j, p, identifier, property);
		} else {
			return cb(p);
		}
	}
}

/**
 *
 * Creates a function call with arguments
 * @param {any} j — jscodeshift API
 * @param {Node} p - Node to push against
 * @param {String} name - Name for the given function
 * @returns {Node} -  Returns the node for the created
 * function
 */

function createFunctionWithArguments(j, p, name) {
	if (typeof name === "object") {
		let node;
		Object.keys(name).forEach(key => {
			const pluginExist = findPluginsByName(j, j(p), [key]);
			if (pluginExist.size() !== 0) {
				let pluginName =
					key.indexOf("webpack") >= 0
						? key.indexOf("webpack.optimize") >= 0
							? key.replace("webpack.optimize.", " ")
							: key.replace("webpack.", " ")
						: key;
				pluginExist
					.filter(
						p => pluginName.trim(" ") === p.value.callee.property.name.trim(" ")
					)
					.forEach(n => {
						Object.keys(name[key]).forEach(subKey => {
							const foundNode = findRootNodesByName(j, j(n), subKey);
							if (foundNode.size() !== 0) {
								foundNode.forEach(n => {
									j(n).replaceWith(
										createObjectWithSuppliedProperty(
											j,
											subKey,
											createIdentifierOrLiteral(j, name[key][subKey])
										)
									);
									node = createObjectWithSuppliedProperty(
										j,
										subKey,
										createIdentifierOrLiteral(j, name[key][subKey])
									);
								});
							} else {
								const method = j.property(
									"init",
									createLiteral(j, subKey),
									createIdentifierOrLiteral(j, name[key][subKey])
								);
								n.value.arguments[0].properties.push(method);
								node = null;
								//node.arguments.push(j.objectExpression([method]));
							}
						});
					});
				return node;
			}
			node = j.newExpression(j.identifier(key), []);
			return Object.keys(name[key]).forEach(subKey => {
				const method = createObjectWithSuppliedProperty(
					j,
					subKey,
					createIdentifierOrLiteral(j, name[key][subKey])
				);
				node.arguments.push(j.objectExpression([method]));
			});
		});
		return node;
	}
	return j.callExpression(j.identifier(name), [
		j.literal("/* Add your arguments here */")
	]);
}

module.exports = {
	safeTraverse,
	createProperty,
	findPluginsByName,
	findRootNodesByName,
	addOrUpdateConfigObject,
	findAndRemovePluginByName,
	createOrUpdatePluginByName,
	findVariableToPlugin,
	isType,
	createLiteral,
	createIdentifierOrLiteral,
	findObjWithOneOfKeys,
	getRequire,
	checkIfExistsAndAddValue,
	createArrayWithChildren,
	createEmptyArrayProperty,
	createObjectWithSuppliedProperty,
	createExternalRegExp,
	createFunctionWithArguments,
	pushCreateProperty,
	pushObjectKeys,
	isAssignment,
	loopThroughObjects
};
