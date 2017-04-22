const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createBailProperty(p) {
		let bailVal = transformUtils.createIdentifierOrLiteral(j, webpackProperties['bail']);

		return p.value.properties.push(
			transformUtils.createPropertyWithSuppliedProperty(j, 'bail', bailVal)
		);
	}

	if(webpackProperties['bail']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createBailProperty));
	} else {
		return ast;
	}
};
