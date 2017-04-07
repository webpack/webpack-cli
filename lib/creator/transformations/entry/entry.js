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

	function createEntryProperty(p) {
		return p.value.properties.push(utils.createProperty(j, 'entry', '{}'));
	}

	return ast.find(j.ObjectExpression)
		.filter(p => createEntryProperty(p));
};
