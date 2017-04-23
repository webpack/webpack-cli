const performanceTypes = require('./performance-types');
const isAssignment = require('../../../transformations/utils').isAssignment;
const utils = require('../../../transformations/utils');


/*
*
* Transform for performance. Finds the performance property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {

	function createPerformanceProperty(p) {

		utils.pushCreateProperty(j, p, 'performance', j.objectExpression([]));
		let performanceNode = p.value.properties;
		performanceNode.filter(n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'performance')
		).forEach( (prop) => {
			Object.keys(webpackProperties).forEach( (webpackProp) => {
				if(performanceTypes.includes(webpackProp)) {
					utils.pushCreateProperty(
						j, prop, webpackProp, webpackProperties[webpackProp]
					);
				}
			});
		});
	}
	if(webpackProperties && typeof(webpackProperties) === 'object') {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(null, p, createPerformanceProperty));
	} else {
		return ast;
	}
};
