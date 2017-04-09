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
	function createCacheProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			// TODO: let people add obj by reference.
			// webpackProperties['cache']
			p.value.properties.push(utils.createProperty(j, 'cache', 'TODO'));
		}
	}
	if(typeof(webpackProperties['cache']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => {
			if(p.parent.value.type === 'AssignmentExpression') {
				return p.value.properties.push(utils.createProperty(j, 'cache', webpackProperties['cache']));
			}
		});
	}
	else if(webpackProperties['cache'] && typeof(webpackProperties['cache']) === 'object') {
		return ast.find(j.ObjectExpression).filter(p => createCacheProperty(p));
	} else {
		return ast;
	}
};
