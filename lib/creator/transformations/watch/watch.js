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
	function createWatchProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			return p.value.properties.push(utils.createProperty(j, 'watch', webpackProperties['watch']));
		}
	}
	if(typeof(webpackProperties['watch']) === 'boolean' && webpackProperties.hasOwnProperty('watch')) {
		return ast.find(j.ObjectExpression).filter(p => createWatchProperty(p));
	} else {
		return ast;
	}
};
