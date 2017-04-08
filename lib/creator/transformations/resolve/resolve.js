const utils = require('../../../transformations/utils');
const resolveTypes = require('./resolve-types');
/*
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
*/

module.exports = function(j, ast, webpackProperties) {
	function createResolveProperties(j, p) {
		if(webpackProperties['resolve']) {
			if(p.parent.value.type === 'AssignmentExpression') {
				p.value.properties.push(utils.createProperty(j, 'resolve', 'null'));
			}
			p.value.properties.filter(node => node.key.value === 'resolve').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.resolve).filter( (webpackProp) => {
					if(resolveTypes.includes(webpackProp)) {
						if(Array.isArray(webpackProperties.resolve[webpackProp])) {
							// if we got a type, we make it an array
						} else {
							prop.value.properties.push(utils.createProperty(j, webpackProp, null));
							prop.value.properties[0].value.type = 'ObjectExpression';
							prop.value.properties[0].value.properties = [];
							Object.keys(webpackProperties.resolve[webpackProp]).forEach( (resolveProps) => {
								prop.value.properties[0].value.properties.push(
									utils.createProperty(j, resolveProps, webpackProperties.resolve[webpackProp][resolveProps])
								);
							});
						}
					}
				});
			});
		}
		else if(webpackProperties['resolve'].length) {
			throw new Error('Resolve needs properties');
		}
		else {
			return ast;
		}
	}
	return ast.find(j.ObjectExpression).filter(p => createResolveProperties(j, p));
};
