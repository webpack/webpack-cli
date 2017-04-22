const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createNodeProperty(p) {
		let node = p.value.properties;
		node.push(
			transformUtils.createPropertyWithSuppliedProperty(j, 'node', j.objectExpression([]))
		);
		node.filter(n =>
			(transformUtils.safeTraverse(n, ['key', 'name']) === 'node')
		).forEach( (prop) => {
			Object.keys(webpackProperties.node).forEach( (webpackProp) => {
				prop.value.properties.push(
					transformUtils.createPropertyWithSuppliedProperty(
						j,
						webpackProp,
						transformUtils.createIdentifierOrLiteral(
							j,
							webpackProperties.node[webpackProp]
						)
					)
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
