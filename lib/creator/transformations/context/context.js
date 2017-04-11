module.exports = function(j, ast, webpackProperties) {
	function createContextProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			if(webpackProperties['context'].__paths) {
				let contextProp = webpackProperties['context'].__paths[0].value.program.body[0].expression;
				return p.value.properties.push(j.property('init', j.identifier('context'), contextProp));
			} else {
				return p.value.properties.push(
					j.property('init', j.identifier('context'), j.literal(webpackProperties['context']))
				);
			}
		}
	}
	if(webpackProperties['context'] && webpackProperties['context'].length) {
		return ast.find(j.ObjectExpression).filter(p => createContextProperty(p));
	} else {
		return ast;
	}
};
