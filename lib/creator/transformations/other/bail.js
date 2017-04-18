const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createBailProperty(p) {
		let propVal = transformUtils.createIdentifierOrLiteral(j, webpackProperties['bail']);
		transformUtils.checkIfExistsAndAddValue(j, p, 'bail', propVal);
	}

	if(webpackProperties['bail']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createBailProperty));
	} else {
		return ast;
	}
};
