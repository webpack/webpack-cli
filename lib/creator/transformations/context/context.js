const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createContextProperty(p) {
		return p.value.properties.push(
			transformUtils.createPropertyWithSuppliedProperty(
				j, 'context', j.identifier(webpackProperties['context'])
			)
		);
	}

	if(webpackProperties['context']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createContextProperty));
	} else {
		return ast;
	}
};
