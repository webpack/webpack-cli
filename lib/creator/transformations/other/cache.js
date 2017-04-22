const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createCacheProperty(p) {
		let cacheVal = transformUtils.createIdentifierOrLiteral(j, webpackProperties['cache']);

		return p.value.properties.push(
			transformUtils.createPropertyWithSuppliedProperty(j, 'cache', cacheVal)
		);
	}

	if(webpackProperties['cache']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createCacheProperty));
	} else {
		return ast;
	}
};
