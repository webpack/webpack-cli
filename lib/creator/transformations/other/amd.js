const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createAMDProperty(p) {
		const amd = webpackProperties['amd'];
		const propVal = j.objectExpression(
			Object.keys(amd).map(prop => {
				return j.property('init', j.identifier(prop),
					transformUtils.createIdentifierOrLiteral(j, amd[prop])
				);
			})
		);
		transformUtils.checkIfExistsAndAddValue(j, p, 'amd', propVal);
	}
	if(webpackProperties['amd'] && typeof(webpackProperties['amd']) === 'object') {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createAMDProperty));
	} else {
		return ast;
	}
};
