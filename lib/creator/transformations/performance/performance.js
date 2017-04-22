const performanceTypes = require('./performance-types');
const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');


/*
*
* Transform for performance. Finds the performance property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createPerformanceProperty(p) {
		let performanceNode = p.value.properties;
		performanceNode.push(
			transformUtils.createPropertyWithSuppliedProperty(
				j, 'performance', j.objectExpression([])
			)
		);
		performanceNode.filter(n =>
			(transformUtils.safeTraverse(n, ['key', 'name']) === 'performance')
		).forEach( (prop) => {
			Object.keys(webpackProperties.performance).forEach( (webpackProp) => {
				if(performanceTypes.includes(webpackProp)) {
					prop.value.properties.push(
						transformUtils.createPropertyWithSuppliedProperty(
							j,
							webpackProp,
							transformUtils.createIdentifierOrLiteral(
								j,
								webpackProperties.performance[webpackProp]
							)
						)
					);
				}
			});
		});
	}
	if(webpackProperties['performance'] && typeof(webpackProperties['performance']) === 'object') {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createPerformanceProperty));
	} else {
		return ast;
	}
};
