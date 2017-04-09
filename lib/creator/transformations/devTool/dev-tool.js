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
	function createDevToolProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			return p.value.properties.push(utils.createProperty(j, 'devtool', webpackProperties['devtool']));
		}
	}
	if(webpackProperties['devtool'] && webpackProperties['devtool'].length) {
		return ast.find(j.ObjectExpression).filter(p => createDevToolProperty(p));
	} else {
		return ast;
	}
};
