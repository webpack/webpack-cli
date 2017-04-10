module.exports = function(j, ast, webpackProperties) {
	function createBailProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(j.property('init', j.identifier('bail'), j.literal(webpackProperties['bail'])));
		}
	}
	if(typeof(webpackProperties['bail']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => createBailProperty(p));
	} else {
		return ast;
	}
};
