const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createContextProperty(p) {
		const propValue = transformUtils.createIdentifierOrLiteral(j, webpackProperties['context']);
		transformUtils.checkIfExistsAndAddValue(j, p, 'context', propValue);
	}

	if(webpackProperties['context'] && webpackProperties['context'].length) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createContextProperty));
	} else {
		return ast;
	}
};
