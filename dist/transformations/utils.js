//      
// eslint-disable-next-line node/no-unsupported-features
             
             
       
           
          
             
                     
                   
                 
                  

function safeTraverse(obj        , paths          )       {
	let val         = obj;
	let idx         = 0;

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
function memberExpressionToPathString(path        )         {
	if (path && path.object) {
		return [memberExpressionToPathString(path.object), path.property.name].join(
			"."
		);
	}
	return path.name;
}

// Convert Array<string> like ['webpack', 'optimize', 'DedupePlugin'] to nested MemberExpressions
function pathsToMemberExpression(j             , paths          ) {
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

/*
* @function findPluginsByName
*
* Find paths that match `new name.space.PluginName()` for a given array of plugin names
*
* @param j — jscodeshift API
* @param { Node } node - Node to start search from
* @param { Array<String> } pluginNamesArray - Array of plugin names like `webpack.LoaderOptionsPlugin`
* @returns Path
 * */
function findPluginsByName(
	j             ,
	node          ,
	pluginNamesArray          
)           {
	return node.find(j.NewExpression).filter(path => {
		return pluginNamesArray.some(
			plugin =>
				memberExpressionToPathString(path.get("callee").value) === plugin
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
function findPluginsRootNodes(
	j             ,
	node          
)                      {
	return node.find(j.Property, { key: { name: "plugins" } });
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
function createProperty(
	j             ,
	key                 ,
	value     
)               {
	return j.property(
		"init",
		createIdentifierOrLiteral(j, key),
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

function createLiteral(
	j             ,
	val                           
)                  {
	let literalVal      = val;
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

/*
 * @function createIdentifierOrLiteral
 *
 * Creates an appropriate identifier or literal property
 *
 * @param j — jscodeshift API
 * @param { string | boolean | number } val
 * @returns { Node }
 * */

function createIdentifierOrLiteral(j             , val     )      {
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
/*
 * @function createOrUpdatePluginByName
 *
 * Findes or creates a node for a given plugin name string with options object
 * If plugin decalaration already exist, options are merged.
 *
 * @param j — jscodeshift API
 * @param { NodePath } rooNodePath - `plugins: []` NodePath where plugin should be added. See https://github.com/facebook/jscodeshift/wiki/jscodeshift-Documentation#nodepaths
 * @param { string } pluginName - ex. `webpack.LoaderOptionsPlugin`
 * @param { Object } options - plugin options
 * @returns void
 * */
function createOrUpdatePluginByName(
	j             ,
	rootNodePath          ,
	pluginName        ,
	options     
) {
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

					optionsProps.forEach((opt     ) => {
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

function findVariableToPlugin(
	j             ,
	rootNode          ,
	pluginPackageName        
)          {
	const moduleVarNames                        = rootNode
		.find(j.VariableDeclarator)
		.filter(j.filters.VariableDeclarator.requiresModule(pluginPackageName))
		.nodes();
	if (moduleVarNames.length === 0) return null;
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

function isType(path          , type        )          {
	return path.type === type;
}

function findObjWithOneOfKeys(p          , keyNames          )          {
	return p.value.properties.reduce((predicate, prop) => {
		const name = prop.key.name;
		return keyNames.indexOf(name) > -1 || predicate;
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

function getRequire(
	j             ,
	constName        ,
	packagePath        
)                             {
	return j.variableDeclaration("const", [
		j.variableDeclarator(
			j.identifier(constName),
			j.callExpression(j.identifier("require"), [j.literal(packagePath)])
		)
	]);
}

/*
* @function checkIfExistsAndAddValue
*
* If a prop exists, it overrides it, else it creates a new one
* @param j — jscodeshift API
* @param { Node } node - objectexpression to check
* @param { string } key - Key of the property
* @param { string } value - computed value of the property
* @returns - nothing
*/

function checkIfExistsAndAddValue(
	j             ,
	node                          ,
	key        ,
	value        
)       {
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

/*
* @function createEmptyArrayProperty
*
* Creates an empty array
* @param j — jscodeshift API
* @param { String } key - st name
* @returns - { Array } arr - An empty array
*/
function createEmptyArrayProperty(
	j             ,
	key        
)                              {
	return j.property("init", j.identifier(key), j.arrayExpression([]));
}

/*
* @function createArrayWithChildren
*
* Creates an array and iterates on an object with properties
* @param j — jscodeshift API
* @param { String } key - object name
* @param { string } subProps - computed value of the property
* @param { Boolean } shouldDropKeys -
* @returns - { Array } arr - An array with the object properties
*/

function createArrayWithChildren(
	j             ,
	key        ,
	subProps                   ,
	shouldDropKeys         
) {
	let arr = createEmptyArrayProperty(j, key);
	if (shouldDropKeys) {
		subProps.forEach((subProperty          ) => {
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

/*
* @function loopThroughObjects
*
* Loops through an object and adds property to an object with no identifier
* @param j — jscodeshift API
* @param { Node } p - node to add value to
* @param { Object } obj - Object to loop through
* @returns - { Function|Node } - Either pushes the node, or reruns until
* nothing is left
*/

function loopThroughObjects(
	j             ,
	p                   ,
	obj        
)       {
	Object.keys(obj).forEach(prop => {
		if (prop.indexOf("inject") >= 0) {
			// TODO to insert the type of node, identifier or literal
			const propertyExpression           = createIdentifierOrLiteral(
				j,
				obj[prop]
			);
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

/*
* @function createObjectWithSuppliedProperty
*
* Creates an object with an supplied property as parameter
* @param j — jscodeshift API
* @param { String } key - object name
* @param { Node } prop - property to be added
* @returns - { Node } - An property with the supplied property
*/

function createObjectWithSuppliedProperty(
	j             ,
	key        ,
	prop     
)               {
	return j.property("init", j.identifier(key), prop);
}

/*
* @function createExternalRegExp
*
* Finds a regexp property with an already parsed AST from the user
* @param j — jscodeshift API
* @param { String } prop - property to find the value at
* @returns - { Node } - A literal node with the found regexp
*/

function createExternalRegExp(j             , prop     )                  {
	let regExpProp = prop.__paths[0].value.program.body[0].expression;
	return j.literal(regExpProp.value);
}

/*
* @function pushCreateProperty
*
* Creates a property and pushes the value to a node
* @param j — jscodeshift API
* @param { Node } p - Node to push against
* @param { String } key - key used as identifier
* @param { String } val - property value
* @returns - { Node } - Returns node the pushed property
*/

function pushCreateProperty(
	j             ,
	p                          ,
	key        ,
	val     
)         {
	let property                                               ;
	if (val.hasOwnProperty("type")) {
		property = val;
	} else {
		property = createIdentifierOrLiteral(j, val);
	}
	return p.value.properties.push(
		createObjectWithSuppliedProperty(j, key, property)
	);
}

/*
* @function pushObjectKeys
*
* @param j — jscodeshift API
* @param { Node } p - path to push
* @param { Object } webpackProperties - The object to loop over
* @param { String } name - Key that will be the identifier we find and add values to
* @returns - { Node/Function } Returns a function that will push a node if
*subProperty is an array, else it will invoke a function that will push a single node
*/

function pushObjectKeys(
	j             ,
	p          ,
	webpackProperties        ,
	name        
)      {
	p.value.properties
		.filter(n => safeTraverse(n, ["key", "name"]) === name)
		.forEach(prop => {
			Object.keys(webpackProperties).forEach(webpackProp => {
				if (webpackProp.indexOf("inject") >= 0) {
					return prop.value.properties.push(
						createIdentifierOrLiteral(j, webpackProperties[webpackProp])
					);
				} else if (Array.isArray(webpackProperties[webpackProp])) {
					const propArray = createArrayWithChildren(
						j,
						webpackProp,
						webpackProperties[webpackProp],
						true
					);
					return prop.value.properties.push(propArray);
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
					pushCreateProperty(j, prop, webpackProp, j.objectExpression([]));
					return pushObjectKeys(
						j,
						prop,
						webpackProperties[webpackProp],
						webpackProp
					);
				}
			});
		});
}

/*
* @function isAssignment
*
* Checks if we are at the correct node and later invokes a callback
* for the transforms to either use their own transform function or
* use pushCreateProperty if the transform doesn't expect any properties
* @param j — jscodeshift API
* @param { Node } p - Node to push against
* @param { Function } cb - callback to be invoked
* @param { String } identifier - key to use as property
* @param { Object } property - WebpackOptions that later will be converted via
* pushCreateProperty via WebpackOptions[identifier]
* @returns - { Function } cb - Returns the callback and pushes a new node
*/

function isAssignment(
	j             ,
	p          ,
	cb            ,
	identifier        ,
	property        
)      {
	if (p.parent.value.type === "AssignmentExpression") {
		if (j) {
			return cb(j, p, identifier, property);
		} else {
			return cb(p);
		}
	}
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
	createIdentifierOrLiteral,
	findObjWithOneOfKeys,
	getRequire,
	checkIfExistsAndAddValue,
	createArrayWithChildren,
	createEmptyArrayProperty,
	createObjectWithSuppliedProperty,
	createExternalRegExp,
	pushCreateProperty,
	pushObjectKeys,
	isAssignment,
	loopThroughObjects
};
