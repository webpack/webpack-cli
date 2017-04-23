const isAssignment = require('../../../transformations/utils').isAssignment;
const createSingularProperty = require('../../../transformations/utils').createSingularProperty;


/*
*
* Transform for bail. Finds the bail property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {

	if(webpackProperties) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(j, p, createSingularProperty, 'bail', webpackProperties));
	} else {
		return ast;
	}
};
