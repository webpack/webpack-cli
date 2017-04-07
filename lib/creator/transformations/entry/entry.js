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
	function createEntryProperty(j, p) {
		p.value.properties.push(utils.createProperty(j, 'entry', 'null'));
		if(webpackProperties['entry'].length || typeof webpackProperties['entry'] === 'function') {
			p.value.properties[0].value.value = webpackProperties['entry'];
		} else {
			p.value.properties[0].value.type = 'ObjectExpression';
			p.value.properties[0].value.properties = [];
			Object.keys(webpackProperties.entry).forEach( (prop) => {
				p.value.properties[0].value.properties.push(
					utils.createProperty(j, prop, webpackProperties.entry[prop])
				);
			});
		}
	}
	return ast.find(j.ObjectExpression).filter(p => createEntryProperty(j, p));
};
