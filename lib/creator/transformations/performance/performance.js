const performanceTypes = require('./performance-types');
const isAssignment = require('../../utils/is-assignment');
const utils = require('../../../transformations/utils');


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

		utils.pushCreateProperty(j, p, 'performance', j.objectExpression([]));
		let performanceNode = p.value.properties;
		performanceNode.filter(n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'performance')
		).forEach( (prop) => {
			Object.keys(webpackProperties.performance).forEach( (webpackProp) => {
				if(performanceTypes.includes(webpackProp)) {
					utils.pushCreateProperty(
						j, prop, webpackProp, webpackProperties.performance[webpackProp]
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
