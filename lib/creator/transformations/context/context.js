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
	function createContextProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			return p.value.properties.push(utils.createProperty(j, 'context', webpackProperties['context']));
		}
	}
	if(webpackProperties['context'] && webpackProperties['context'].length) {
		return ast.find(j.ObjectExpression).filter(p => createContextProperty(p));
	} else {
		return ast;
	}
};
