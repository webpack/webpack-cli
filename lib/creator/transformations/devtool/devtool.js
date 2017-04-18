const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createDevToolProperty(p) {
		const propValue = j.literal(webpackProperties['devtool']);
		transformUtils.checkIfExistsAndAddValue(j, p, 'devtools', propValue);
	}
	if(webpackProperties['devtool'] && webpackProperties['devtool'].length) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createDevToolProperty));
	} else {
		return ast;
	}
};
