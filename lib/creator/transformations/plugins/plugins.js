
module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createPluginsProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			const pluginArray = j.property('init', j.identifier('plugins'), j.arrayExpression([]));
			Object.keys(webpackProperties.plugins).forEach( (plugin) => {
				if(webpackProperties.plugins[plugin]) {
					pluginArray.value.elements.push(webpackProperties.plugins[plugin]);
				}
			});
			return p.value.properties.push(pluginArray);
		}
	}
	if(webpackProperties['plugins'] && Array.isArray(webpackProperties['plugins'])) {
		return ast.find(j.ObjectExpression).filter(p => createPluginsProperty(p));
	} else {
		return ast;
	}
};
