import { IJSCodeshift, INode, valueType } from "./types/NodePath";
import * as validateIdentifier from "./validate-identifier";

/**
 *
 * Traverse safely over a path object for array for paths
 * @param {Object} obj - Object on which we traverse
 * @param {Array} paths - Array of strings containing the traversal path
 * @returns {Any} Value at given traversal path
 */
function safeTraverse(obj: INode, paths: string[]): any {
	let val: INode = obj;
	let idx: number = 0;

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
function safeTraverseAndGetType(path: INode): string | boolean {
	const pathValue: INode = safeTraverse(path, ["value", "value"]);
	return pathValue ? pathValue.type : false;
}

// Convert nested MemberExpressions to strings like webpack.optimize.DedupePlugin
function memberExpressionToPathString(path: INode) {
	if (path && path.object) {
		return [memberExpressionToPathString(path.object), path.property.name].join(
			".",
		);
	}
	return path.name;
}

// Convert Array<string> like ['webpack', 'optimize', 'DedupePlugin'] to nested MemberExpressions
function pathsToMemberExpression(j: IJSCodeshift, paths: string[]): INode {
	if (!paths.length) {
		return null;
	} else if (paths.length === 1) {
		return j.identifier(paths[0]);
	} else {
		const first: string[] = paths.slice(0, 1);
		const rest: string[] = paths.slice(1);
		return j.memberExpression(
			pathsToMemberExpression(j, rest),
			pathsToMemberExpression(j, first),
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

function findPluginsByName(j: IJSCodeshift, node: INode, pluginNamesArray: string[]): INode {
	return node
		.find(j.NewExpression)
		.filter((path: INode): boolean => {
			return pluginNamesArray.some(
				(plugin: string) =>
					memberExpressionToPathString(path.get("callee").value) === plugin,
			);
	});
}

/**
 * It lookouts for the plugins property and, if the array is empty, it removes it from the AST
 * @param  {any} j - jscodeshift API
 * @param  {Node} rootNode - node to start search from
 * @returns {Node} rootNode modified AST.
 */

function findPluginsArrayAndRemoveIfEmpty(j: IJSCodeshift, rootNode: INode): INode {
	return rootNode
		.find(j.Identifier, { name: "plugins" })
		.forEach((node: INode) => {
			const elements: INode[] = safeTraverse(node, [
				"parent",
				"value",
				"value",
				"elements",
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

function findRootNodesByName(j: IJSCodeshift, node: INode, propName: string): INode {
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

function createProperty(j: IJSCodeshift, key: string | number, value: valueType): INode {
	return j.property(
		"init",
		createIdentifierOrLiteral(j, key),
		createLiteral(j, value),
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

function createLiteral(j: IJSCodeshift, val: valueType): INode {
	let literalVal: valueType = val;
	// We'll need String to native type conversions
	if (typeof val === "string") {
		// 'true' => true
		if (val === "true") { literalVal = true; }
		// 'false' => false
		if (val === "false") { literalVal = false; }
		// '1' => 1
		if (!isNaN(Number(val))) { literalVal = Number(val); }
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

function createIdentifierOrLiteral(j: IJSCodeshift, val: valueType): INode {
	// IPath<IIdentifier> | IPath<ILiteral> doesn't work, find another way
	let literalVal = val;
	// We'll need String to native type conversions
	if (!Array.isArray(val)) {
		if (typeof val === "string" || typeof val === "object" && val.__paths) {
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
			if (typeof val === "object" && val.__paths) {
				const regExpVal = val.__paths[0].value.program.body[0].expression;
				return j.literal(regExpVal.value);
			} else if (typeof literalVal === "string") {
				// Use identifier instead
				if (
					!validateIdentifier.isKeyword(literalVal) ||
					!validateIdentifier.isIdentifierStart(literalVal) ||
					!validateIdentifier.isIdentifierChar(literalVal)
				) {
					return j.identifier(literalVal);
				}
			}
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

function addOrUpdateConfigObject(
	j: IJSCodeshift, rootNode: INode, configProperty: string, key: string, value: valueType,
): void {

	const propertyExists = rootNode.properties.filter(
		(node: INode): boolean => node.key.name === configProperty,
	).length;

	if (propertyExists) {
		rootNode.properties
			.filter((path: INode) => path.key.name === configProperty)
			.forEach((path: INode) => {
				const newProperties = path.value.properties.filter(
					(p: INode) => p.key.name !== key,
				);
				newProperties.push(
					j.objectProperty(
						j.identifier(key), value,
					),
				);
				path.value.properties = newProperties;
			});
	} else {
		rootNode.properties.push(
			j.objectProperty(
				j.identifier(configProperty),
				j.objectExpression(
					[j.objectProperty(j.identifier(key), value)],
				),
			),
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

function findAndRemovePluginByName(j: IJSCodeshift, node: INode, pluginName: string): INode {
	let rootPath: INode;

	findPluginsByName(j, node, [pluginName])
		.filter((path: INode) => safeTraverse(path, ["parent", "value"]))
		.forEach((path: INode) => {
			rootPath = safeTraverse(path, ["parent", "parent", "parent", "value"]);
			const arrayPath: INode = path.parent.value;
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
 * @param {Node} rootNodePath - `plugins: []` NodePath where plugin should be added.
 * 								See https://github.com/facebook/jscodeshift/wiki/jscodeshift-Documentation#nodepaths
 * @param {String} pluginName - ex. `webpack.LoaderOptionsPlugin`
 * @param {Object} options - plugin options
 * @returns {Void}
 */

function createOrUpdatePluginByName(j: IJSCodeshift, rootNodePath: INode, pluginName: string, options: object): void {
	const pluginInstancePath: INode = findPluginsByName(j, j(rootNodePath), [
		pluginName,
	]);
	let optionsProps: INode[];
	if (options) {
		optionsProps = Object.keys(options).map((key: string) => {
			return createProperty(j, key, options[key]);
		});
	}

	// If plugin declaration already exist
	if (pluginInstancePath.size()) {
		pluginInstancePath.forEach((path: INode) => {
			// There are options we want to pass as argument
			if (optionsProps) {
				const args: INode[] = path.value.arguments;
				if (args.length) {
					// Plugin is called with object as arguments
					// we will merge those objects
					const currentProps: INode = j(path)
						.find(j.ObjectExpression)
						.get("properties");

					optionsProps.forEach((opt: INode) => {
						// Search for same keys in the existing object
						const existingProps = j(currentProps)
							.find(j.Identifier)
							.filter((p: INode) => opt.key.value === p.value.name);

						if (existingProps.size()) {
							// Replacing values for the same key
							existingProps.forEach((p: INode) => {
								j(p.parent).replaceWith(opt);
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
		let argumentsArray: INode[] = [];
		if (optionsProps) {
			argumentsArray = [j.objectExpression(optionsProps)];
		}
		const loaderPluginInstance = j.newExpression(
			pathsToMemberExpression(j, pluginName.split(".").reverse()),
			argumentsArray,
		);
		rootNodePath.value.elements.push(loaderPluginInstance);
	}
}

/**
 *
 * Finds the variable to which a third party plugin is assigned to
 *
 * @param {any} j — jscodeshift API
 * @param {Node} rootNode - `plugins: []` Root Node.
 * 							See https://github.com/facebook/jscodeshift/wiki/jscodeshift-Documentation#nodepaths
 * @param {String} pluginPackageName - ex. `extract-text-plugin`
 * @returns {String} variable name - ex. 'const s = require(s) gives "s"`
 */

function findVariableToPlugin(j: IJSCodeshift, rootNode: INode, pluginPackageName: string): string {
	const moduleVarNames: INode[] = rootNode
		.find(j.VariableDeclarator)
		.filter(j.filters.VariableDeclarator.requiresModule(pluginPackageName))
		.nodes();
	if (moduleVarNames.length === 0) { return null; }
	return moduleVarNames.pop().id.name;
}

/**
 *
 * Returns true if type is given type
 * @param {Node} path - AST node
 * @param {String} type - node type
 * @returns {Boolean}
 */

function isType(path: INode, type: string): boolean {
	return path.type === type;
}

function findObjWithOneOfKeys(p: INode, keyNames: string[]) {
	return p.value.properties.reduce((predicate: boolean, prop: INode) => {
		const name: string = prop.key.name;
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

function getRequire(j: IJSCodeshift, constName: string, packagePath: string): INode {
	return j.variableDeclaration("const", [
		j.variableDeclarator(
			j.identifier(constName),
			j.callExpression(j.identifier("require"), [j.literal(packagePath)]),
		),
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

function addProperty(j: IJSCodeshift, p: INode, key: string, value: valueType, action?: string): INode {
	if (!p) {
		return;
	}
	let valForNode: valueType;
	if (Array.isArray(value)) {
		let arrExp: INode = j.arrayExpression([]);
		if (safeTraverseAndGetType(p) === "ArrayExpression") {
			arrExp = p.value.value;
		}
		value.forEach((val: valueType) => {
			addProperty(j, arrExp, null, val);
		});
		valForNode = arrExp;
	} else if (
		typeof value === "object" &&
		!(value.__paths || value instanceof RegExp)
	) {
		let objectExp: INode = j.objectExpression([]);
		if (safeTraverseAndGetType(p) === "ObjectExpression") {
			objectExp = p.value.value;
		}
		// object -> loop through it
		Object.keys(value).forEach((prop: string) => {
			addProperty(j, objectExp, prop, value[prop]);
		});
		valForNode = objectExp;
	} else {
		valForNode = createIdentifierOrLiteral(j, value);
	}
	let pushVal: valueType;
	if (key) {
		pushVal = j.property("init", j.identifier(key), valForNode);
	} else {
		pushVal = valForNode;
	}

	// we only return the generated pushVal which will be replace the node path
	if (action === "add") { return pushVal; }

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
 * Removes an object/property from the config
 * @param {any} j — jscodeshift API
 * @param {Node} ast - AST node
 * @param {String} key - key of a key/val object
 * @param {Any} value - Any type of object
 * @returns {Node} - the created ast
 */

function removeProperty(j: IJSCodeshift, ast: INode, key: string, value: valueType): INode {

	if (typeof value === "object" && !Array.isArray(value)) {
		// override for module.rules / loaders
		if (key === "module" && value.rules) {
			return ast
				.find(j.Property, {
					value: {
						type: "Literal",
						value: value.rules[0].loader,
					},
				})
				.forEach((p: INode) => {
					j(p.parent).remove();
				});
		}
	}

	// value => array
	if (Array.isArray(value)) {
		return ast
			.find(j.Literal, {
				value: value[0],
			})
			.forEach((p: INode) => {
				const configKey = safeTraverse(p, ["parent", "parent", "node", "key", "name"]);
				if (configKey === key) {
					j(p).remove();
				}
			});
	}

	// value => literal string / boolean / nested object
	let objKeyToRemove: string | null = null;
	if (value === null) {
		objKeyToRemove = key;
	} else if (typeof value === "object") {
		for (const innerKey in value) {
			if (value[innerKey] === null) { objKeyToRemove = innerKey; }
		}
	}
	return ast
		.find(j.Property, {
			key: {
				name: objKeyToRemove,
				type: "Identifier",
			},
		})
		.forEach((p: INode) => {
			j(p).remove();
		});
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

function parseTopScope(j: IJSCodeshift, ast: INode, value: string[], action: string): boolean | INode {
	function createTopScopeProperty(p: INode): boolean {
		value.forEach((n: string) => {
			if (
				!p.value.body[0].declarations ||
				n.indexOf(p.value.body[0].declarations[0].id.name) <= 0
			) {
				p.value.body.splice(-1, 0, n);
			}
		});
		return false; // TODO: debug later
	}
	if (value) {
		return ast.find(j.Program).filter((p: INode): boolean => createTopScopeProperty(p));
	} else {
		return ast;
	}
}

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

function parseMerge(j: IJSCodeshift, ast: INode, value: string, action: string): boolean | INode {
	function createMergeProperty(p: INode) {
		// FIXME Use j.callExp()
		const exportsDecl: INode[] = p.value.body.map((n: INode) => {
			if (n.expression) {
				return n.expression.right;
			}
		});
		const bodyLength = exportsDecl.length;
		const newVal: INode = {};
		newVal.type = "ExpressionStatement";
		newVal.expression = {
			left: {
				computed: false,
				object: j.identifier("module"),
				property: j.identifier("exports"),
				type: "MemberExpression",
			},
			operator: "=",
			right: j.callExpression(j.identifier("merge"), [
				j.identifier(value),
				exportsDecl.pop(),
			]),
			type: "AssignmentExpression",
		};
		p.value.body[bodyLength - 1] = newVal;
		return false; // TODO: debug later
	}
	if (value) {
		return ast.find(j.Program).filter((p: INode): boolean => createMergeProperty(p));
	} else {
		return ast;
	}
}

export {
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
	removeProperty,
	parseTopScope,
	parseMerge,
};
