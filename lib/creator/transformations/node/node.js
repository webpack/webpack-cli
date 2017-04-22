const isAssignment = require('../../utils/is-assignment');
const utils = require('../../../transformations/utils');


/*
*
* Transform for node. Finds the node property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createNodeProperty(p) {
		utils.pushCreateProperty(j, p, 'node', j.objectExpression([]));

		let node = p.value.properties;
		node.filter(n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'node')
		).forEach( (prop) => {
			Object.keys(webpackProperties.node).forEach( (webpackProp) => {
				utils.pushCreateProperty(
					j, prop, webpackProp, webpackProperties.node[webpackProp]
				);
			});
		});
	}
	if(webpackProperties['node']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createNodeProperty));
	} else {
		return ast;
	}
};
