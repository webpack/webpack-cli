module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createDevToolProperty(p) {
		return p.value.properties.push(
			j.property('init',
			j.identifier('devtool'),
			j.identifier(webpackProperties['devtool']))
		);
	}
	if(webpackProperties['devtool'] && webpackProperties['devtool'].length) {
		return ast.find(j.ObjectExpression)
		.filter(p => createDevToolProperty(p));
	} else {
		return ast;
	}
};
