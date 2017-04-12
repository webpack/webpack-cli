module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createCacheProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			if(webpackProperties['cache']) {
				return p.value.properties.push(
					j.property('init', j.identifier('cache'), j.identifier(webpackProperties['cache']))
				);
			}
		}
	}
	if(typeof(webpackProperties['cache']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => {
			if(p.parent.value.type === 'AssignmentExpression') {
				return p.value.properties.push(j.property('init', j.identifier('cache'), j.literal(webpackProperties['cache'])));
			}
		});
	}
	else if(webpackProperties['cache'] && typeof(webpackProperties['cache']) === 'object') {
		return ast.find(j.ObjectExpression).filter(p => createCacheProperty(p));
	} else {
		return ast;
	}
};
