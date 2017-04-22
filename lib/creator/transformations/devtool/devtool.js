const isAssignment = require('../../utils/is-assignment');
const utils = require('../../../transformations/utils');


/*
*
* Transform for devtool. Finds the devtool property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createDevToolProperty(p) {
		return utils.pushCreateProperty(j, p, 'devtool', webpackProperties['devtool']);
	}
	if(webpackProperties['devtool']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createDevToolProperty));
	} else {
		return ast;
	}
};
