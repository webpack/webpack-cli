const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createCacheProperty(p) {
		let propVal = transformUtils.createIdentifierOrLiteral(j, webpackProperties['cache']);
		transformUtils.checkIfExistsAndAddValue(j, p, 'cache', propVal);
	}

	if(webpackProperties['cache']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createCacheProperty));
	} else {
		return ast;
	}
};
