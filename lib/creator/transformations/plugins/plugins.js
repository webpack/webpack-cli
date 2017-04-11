
module.exports = function(j, ast, webpackProperties) {
	function createPluginsProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			const pluginArray = j.property('init', j.identifier('plugins'), j.arrayExpression([]));
			Object.keys(webpackProperties.plugins).forEach( (plugin) => {
				if(webpackProperties.plugins[plugin].__paths) {
					const pluginVal = webpackProperties.plugins[plugin].__paths[0].value.program.body[0];
					pluginArray.value.elements.push(pluginVal);
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
