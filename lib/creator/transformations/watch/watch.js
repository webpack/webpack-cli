module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createWatchProperty(p) {
		return p.value.properties.push(
			j.property('init', j.identifier('watch'), j.literal(webpackProperties['watch']))
		);
	}
	if(typeof(webpackProperties['watch']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => createWatchProperty(p));
	} else {
		return ast;
	}
};
