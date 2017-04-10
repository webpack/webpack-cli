module.exports = function(j, ast, webpackProperties) {
	function createProfileProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(j.property('init', j.identifier('profile'), j.literal(webpackProperties['profile'])));
		}
	}
	if(typeof(webpackProperties['profile']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => createProfileProperty(p));
	} else {
		return ast;
	}
};
