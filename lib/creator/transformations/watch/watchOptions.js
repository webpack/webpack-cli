const watchOptionTypes = require('./watchOptions-types');
const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createWatchOptionsProperty(p) {
		const watchOptions = webpackProperties['watchOptions'];
		const propValue = j.objectExpression(
			Object.keys(watchOptions).map(option => {
				if (watchOptionTypes.includes(option)) {
					return j.property('init', j.identifier(option),
					transformUtils.createIdentifierOrLiteral(j, watchOptions[option]));
				} else {
					throw new Error('Unknown Property', option);
				}
			})
		);
		transformUtils.checkIfExistsAndAddValue(j, p, 'watchOptions', propValue);
	}
	if(webpackProperties['watchOptions'] && webpackProperties['watchOptions']) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createWatchOptionsProperty));
	} else {
		return ast;
	}
};
