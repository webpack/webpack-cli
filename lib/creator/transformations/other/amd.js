const isAssignment = require('../../utils/is-assignment');
const utils = require('../../../transformations/utils');


/*
*
* Transform for amd. Finds the amd property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createAMDProperty(p) {
		utils.pushCreateProperty(j, p, 'amd', j.objectExpression([]));
		let amdNode = p.value.properties;
		amdNode.filter(n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'amd')
		).forEach( (prop) => {
			Object.keys(webpackProperties['amd']).forEach( (webpackProp) => {
				utils.pushCreateProperty(
					j, prop, webpackProp, webpackProperties.amd[webpackProp]
				);
			});
		});
	}
	if(webpackProperties['amd'] && typeof(webpackProperties['amd']) === 'object') {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createAMDProperty));
	} else {
		return ast;
	}
};
