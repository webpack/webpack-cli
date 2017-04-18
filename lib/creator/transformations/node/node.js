const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createNodeProperty(p) {
		const nodeVal = webpackProperties['node'];
		const propVal = j.objectExpression(
			Object.keys(nodeVal).map(prop => {
				return j.property('init', j.identifier(prop),
				transformUtils.createIdentifierOrLiteral(j, nodeVal[prop]));
			})
		);
		transformUtils.checkIfExistsAndAddValue(j, p, 'node', propVal);
	}
	if(webpackProperties['node'] && typeof(webpackProperties['node']) === 'object') {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createNodeProperty));
	} else {
		return ast;
	}
};
