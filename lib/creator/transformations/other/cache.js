const isAssignment = require('../../utils/is-assignment');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createCacheProperty(p) {
		if(typeof(webpackProperties['cache']) === 'object') {
			return p.value.properties.push(
				j.property('init', j.identifier('cache'), j.identifier(webpackProperties['cache']))
			);
		} else {
			p.value.properties.push(
				j.property('init', j.identifier('cache'), j.literal(webpackProperties['cache']))
			);
		}
	}

	if(webpackProperties['cache']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createCacheProperty));
	} else {
		return ast;
	}
};
