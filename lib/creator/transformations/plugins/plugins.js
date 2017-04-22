const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

/*
*
* Transform for plugins. Finds the plugins property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

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
