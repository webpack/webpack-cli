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
	function createBailProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(utils.createProperty(j, 'bail', webpackProperties['bail']));
		}
	}
	if(typeof(webpackProperties['bail']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => createBailProperty(p));
	} else {
		return ast;
	}
};
