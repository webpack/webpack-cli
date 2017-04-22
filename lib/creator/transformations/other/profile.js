const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');


/*
*
* Transform for profile. Finds the profile property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createProfileProperty(p) {
		let profileVal = transformUtils.createIdentifierOrLiteral(j, webpackProperties['profile']);

		return p.value.properties.push(
			transformUtils.createPropertyWithSuppliedProperty(j, 'profile', profileVal)
		);
	}
	if(webpackProperties['profile']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createProfileProperty));
	} else {
		return ast;
	}
};
