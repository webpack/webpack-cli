const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');


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
		let amdNode = p.value.properties;
		amdNode.push(
			transformUtils.createPropertyWithSuppliedProperty(
				j, 'amd', j.objectExpression([])
			)
		);
		amdNode.filter(n =>
			(transformUtils.safeTraverse(n, ['key', 'name']) === 'amd')
		).forEach( (prop) => {
			Object.keys(webpackProperties['amd']).forEach( (webpackProp) => {
				prop.value.properties.push(
						transformUtils.createPropertyWithSuppliedProperty(
							j,
							webpackProp,
							transformUtils.createIdentifierOrLiteral(
								j,
								webpackProperties.amd[webpackProp]
							)
						)
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
