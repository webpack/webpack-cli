const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createProfileProperty(p) {
		let propVal = transformUtils.createIdentifierOrLiteral(j, webpackProperties['profile']);
		transformUtils.checkIfExistsAndAddValue(j, p, 'profile', propVal);
	}
	if(webpackProperties['profile']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createProfileProperty));
	} else {
		return ast;
	}
};
