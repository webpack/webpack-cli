module.exports = function(j, ast, webpackProperties) {
	function createTargetProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			return p.value.properties.push(j.property('init', j.identifier('target'), j.literal(webpackProperties['target'])));
		}
	}
	if(webpackProperties['target'] && webpackProperties['target'].length) {
		return ast.find(j.ObjectExpression).filter(p => createTargetProperty(p));
	} else {
		return ast;
	}
};
