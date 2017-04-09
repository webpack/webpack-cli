const utils = require('../../../transformations/utils');
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
	function createNodeProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(utils.createProperty(j, 'node', null));
			p.value.properties.filter(node => node.key.value === 'node').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.node).forEach( (webpackProp) => {
					prop.value.properties.push(
						utils.createProperty(j, webpackProp, webpackProperties.node[webpackProp])
					);
				});
			});
		}
	}
	if(webpackProperties['node'] && typeof(webpackProperties['node']) === 'object') {
		return ast.find(j.ObjectExpression).filter(p => createNodeProperty(p));
	} else {
		return ast;
	}
};
