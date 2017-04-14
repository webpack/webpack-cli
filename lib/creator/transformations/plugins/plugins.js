const isAssignment = require('../../utils/is-assignment');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createPluginsProperty(p) {
		const pluginArray = j.property('init', j.identifier('plugins'), j.arrayExpression([]));
		Object.keys(webpackProperties.plugins).forEach( (plugin) => {
			if(webpackProperties.plugins[plugin]) {
				pluginArray.value.elements.push(j.identifier(webpackProperties.plugins[plugin]));
			}
		});
		return p.value.properties.push(pluginArray);
	}
	if(webpackProperties['plugins'] && Array.isArray(webpackProperties['plugins'])) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createPluginsProperty));
	} else {
		return ast;
	}
};
