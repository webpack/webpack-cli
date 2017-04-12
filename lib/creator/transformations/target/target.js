module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createTargetProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			return p.value.properties.push(j.property('init', j.identifier('target'), j.identifier(webpackProperties['target'])));
		}
	}
	if(webpackProperties['target'] && webpackProperties['target'].length) {
		return ast.find(j.ObjectExpression).filter(p => createTargetProperty(p));
	} else {
		return ast;
	}
};
