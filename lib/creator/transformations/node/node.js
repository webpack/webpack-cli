const isAssignment = require('../../../transformations/utils').isAssignment;
const utils = require('../../../transformations/utils');


/*
*
* Transform for node. Finds the node property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createNodeProperty(p) {
		utils.pushCreateProperty(j, p, 'node', j.objectExpression([]));

		let node = p.value.properties;
		node.filter(n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'node')
		).forEach( (prop) => {
			Object.keys(webpackProperties).forEach( (webpackProp) => {
				utils.pushCreateProperty(
					j, prop, webpackProp, webpackProperties[webpackProp]
				);
			});
		});
	}
	if(webpackProperties) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(null, p, createNodeProperty));
	} else {
		return ast;
	}
};
