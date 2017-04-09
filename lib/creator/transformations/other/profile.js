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
	function createProfileProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(utils.createProperty(j, 'profile', webpackProperties['profile']));
		}
	}
	if(typeof(webpackProperties['profile']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => createProfileProperty(p));
	} else {
		return ast;
	}
};
