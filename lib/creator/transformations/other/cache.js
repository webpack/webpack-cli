module.exports = function(j, ast, webpackProperties) {
	function createCacheProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			// TODO: let people add obj by reference.
			// webpackProperties['cache']
			return p.value.properties.push(j.property('init', j.identifier('cache'), j.literal(true)));
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
