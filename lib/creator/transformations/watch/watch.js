module.exports = function(j, ast, webpackProperties) {
	function createWatchProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			return p.value.properties.push(j.property('init', j.identifier('watch'), j.literal(webpackProperties['watch'])));
		}
	}
	if(typeof(webpackProperties['watch']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => createWatchProperty(p));
	} else {
		return ast;
	}
};
