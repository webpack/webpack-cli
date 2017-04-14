const utils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createContextProperty(p) {
		return p.value.properties.push(
			utils.createProperty(j, 'context', webpackProperties['context']));
	}

	if(webpackProperties['context']) {
		return ast.find(j.ObjectExpression)
		.filter(p => utils.safeTraverse(p , ['parent', 'value', 'left', 'property', 'name']) === 'exports')
		.forEach(p => createContextProperty(p));
	} else {
		return ast;
	}
};
