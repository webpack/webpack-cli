const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createProfileProperty(p) {
		let profileVal = transformUtils.createIdentifierOrLiteral(j, webpackProperties['profile']);

		return p.value.properties.push(
			transformUtils.createPropertyWithSuppliedProperty(j, 'profile', profileVal)
		);
	}
	if(webpackProperties['profile']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createProfileProperty));
	} else {
		return ast;
	}
};
