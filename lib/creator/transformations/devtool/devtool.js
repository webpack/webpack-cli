module.exports = function(j, ast, webpackProperties) {
	function createDevToolProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			return p.value.properties.push(j.property('init', j.identifier('devtool'), j.literal(webpackProperties['devtool'])));
		}
	}
	if(webpackProperties['devtool'] && webpackProperties['devtool'].length) {
		return ast.find(j.ObjectExpression).filter(p => createDevToolProperty(p));
	} else {
		return ast;
	}
};
