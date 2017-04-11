module.exports = function(j, ast, webpackProperties) {
	function createCacheProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			if(webpackProperties['cache'].__paths) {
				const cacheProp = webpackProperties['cache'].__paths[0].value.program.body[0].expression;
				return p.value.properties.push(j.property('init', j.identifier('cache'), cacheProp));
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
