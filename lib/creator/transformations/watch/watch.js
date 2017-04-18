const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createWatchProperty(p) {
		const propValue = transformUtils.createIdentifierOrLiteral(j, webpackProperties['watch']);
		transformUtils.checkIfExistsAndAddValue(j, p, 'watch', propValue);
	}
	if(typeof(webpackProperties['watch']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createWatchProperty));
	} else {
		return ast;
	}
};


