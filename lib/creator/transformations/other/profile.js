module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createProfileProperty(p) {
		if(typeof(webpackProperties['profile']) === 'boolean') {
			return p.value.properties.push(
				j.property('init', j.identifier('profile'), j.literal(webpackProperties['profile']))
			);
		} else {
			return p.value.properties.push(
				j.property('init', j.identifier('profile'), j.identifier(webpackProperties['profile']))
			);
		}
	}
	if(webpackProperties['profile']) {
		return ast.find(j.ObjectExpression)
		.filter(p => createProfileProperty(p));
	} else {
		return ast;
	}
};
