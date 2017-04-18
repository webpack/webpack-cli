const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createPluginsProperty(p) {
		const plugins = webpackProperties['plugins'];
		const propVal = j.arrayExpression(
			Object.keys(plugins).map(plugin => {
				return j.identifier(plugins[plugin]);
			})
		);
		transformUtils.checkIfExistsAndAddValue(j, p, 'plugins', propVal);
	}
	if(webpackProperties['plugins'] && Array.isArray(webpackProperties['plugins'])) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createPluginsProperty));
	} else {
		return ast;
	}
};
