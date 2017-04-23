const isAssignment = require('../../../transformations/utils').isAssignment;
const createSingularProperty = require('../../../transformations/utils').createSingularProperty;


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
	if(webpackProperties['profile']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(j, p, createSingularProperty, 'profile', webpackProperties));
	} else {
		return ast;
	}
};
