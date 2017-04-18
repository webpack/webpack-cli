const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createTargetProperty(p) {
		const propValue = transformUtils.createIdentifierOrLiteral(j, webpackProperties['target']);
		transformUtils.checkIfExistsAndAddValue(j, p, 'target', propValue);
	}
	if(webpackProperties['target'] && webpackProperties['target'].length) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createTargetProperty));
	} else {
		return ast;
	}
};
