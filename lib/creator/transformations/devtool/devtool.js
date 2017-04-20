const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createDevToolProperty(p) {
		const propValue = transformUtils.createIdentifierOrLiteral(j, webpackProperties['devtool']);
		return transformUtils.checkIfExistsAndAddValue(j, p, 'devtool', propValue);
	}
	if(webpackProperties['devtool']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createDevToolProperty));
	} else {
		return ast;
	}
};
