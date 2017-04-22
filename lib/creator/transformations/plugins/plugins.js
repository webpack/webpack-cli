const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createPluginsProperty(p) {
		const pluginArray = transformUtils.createArrayWithChildren(j, 'plugins', webpackProperties);
		return p.value.properties.push(pluginArray);
	}
	if(webpackProperties['plugins'] && Array.isArray(webpackProperties['plugins'])) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createPluginsProperty));
	} else {
		return ast;
	}
};
