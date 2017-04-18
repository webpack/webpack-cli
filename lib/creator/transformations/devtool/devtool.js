const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createDevToolProperty(p) {
		return p.value.properties.push(
			j.property('init',
			j.identifier('devtool'),
			transformUtils.createIdentifierOrLiteral(j, webpackProperties['devtool']))
		);
	}
	if(webpackProperties['devtool'] && webpackProperties['devtool'].length) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createDevToolProperty));
	} else {
		return ast;
	}
};
