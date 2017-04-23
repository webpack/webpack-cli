const isAssignment = require('../../../transformations/utils').isAssignment;
const pushCreateProperty = require('../../../transformations/utils').pushCreateProperty;

/*
*
* Transform for watch. Finds the watch property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	if(typeof(webpackProperties) === 'boolean') {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(j, p, pushCreateProperty, 'watch', webpackProperties));
	} else {
		return ast;
	}
};
