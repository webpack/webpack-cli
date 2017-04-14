const utils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createContextProperty(p) {
		return p.value.properties.push(
			utils.createProperty(j, 'context', webpackProperties['context']));
	}

	if(webpackProperties['context']) {
		return ast.find(j.ObjectExpression)
		.filter(utils.findWebpackRoot)
		.forEach(p => createContextProperty(p));
	} else {
		return ast;
	}
};
