const isAssignment = require('../../utils/is-assignment');
const utils = require('../../../transformations/utils');


/*
*
* Transform for context. Finds the context property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createContextProperty(p) {
		return utils.pushCreateProperty(j, p, 'context', webpackProperties['context']);
	}

	if(webpackProperties['context']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createContextProperty));
	} else {
		return ast;
	}
};
