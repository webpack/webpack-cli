const isAssignment = require('../../utils/is-assignment');
const utils = require('../../../transformations/utils');


/*
*
* Transform for bail. Finds the bail property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createBailProperty(p) {
		return utils.pushCreateProperty(j, p, 'bail', webpackProperties['bail']);
	}

	if(webpackProperties['bail']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createBailProperty));
	} else {
		return ast;
	}
};
