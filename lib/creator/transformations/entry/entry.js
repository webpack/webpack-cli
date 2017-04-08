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
		p.value.properties.push(utils.createProperty(j, 'entry', 'null'));
		p.value.properties.filter(node => node.key.value === 'entry').forEach( (prop) => {
			if((webpackProperties['entry'] && webpackProperties['entry'].length) || typeof webpackProperties['entry'] === 'function') {
				prop.value.value = webpackProperties['entry'];
			} else {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.entry).forEach( (webpackProps) => {
					prop.value.properties.push(
						utils.createProperty(j, webpackProps, webpackProperties.entry[webpackProps])
					);
				});
			}
		});
	}
	return ast.find(j.ObjectExpression).filter(p => createEntryProperty(p));
};
