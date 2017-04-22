const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');


/*
*
* Transform for cache. Finds the cache property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

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
