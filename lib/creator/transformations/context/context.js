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
		return p.value.properties.push(utils.createProperty(j, 'context', webpackProperties['context']));
	}
	if(webpackProperties['context'].length) {
		return ast.find(j.ObjectExpression).filter(p => createContextProperty(p));
	} else {
		throw new Error('Something went wrong, please submit an issue to the cli repo.');
	}
};
