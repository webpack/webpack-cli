const isAssignment = require('../../utils/is-assignment');
const utils = require('../../../transformations/utils');

/*
*
* Transform for target. Finds the target property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createTargetProperty(p) {
		return utils.pushCreateProperty(j, p, 'target', webpackProperties['target']);
	}
	if(webpackProperties['target'] && webpackProperties['target'].length) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createTargetProperty));
	} else {
		return ast;
	}
};
