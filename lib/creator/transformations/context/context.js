module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createContextProperty(p) {
		return p.value.properties.push(
			j.property('init', j.identifier('context'), j.identifier(webpackProperties['context']))
		);
	}

	if(webpackProperties['context'] && webpackProperties['context'].length) {
		return ast.find(j.ObjectExpression)
		.filter(p => createContextProperty(p));
	} else {
		return ast;
	}
};
