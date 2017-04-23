const watchOptionTypes = require('./watchOptions-types');
const isAssignment = require('../../utils/is-assignment');
const utils = require('../../../transformations/utils');

/*
*
* Transform for watchOptions. Finds the watchOptions property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createWatchOptionsProperty(p) {
		utils.pushCreateProperty(j, p, 'watchOptions', j.objectExpression([]));
		p.value.properties.filter(n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'watchOptions')
		).forEach( (prop) => {
			Object.keys(webpackProperties['watchOptions']).filter( (watchOption) => {
				if(watchOptionTypes.includes(watchOption)) {
					utils.pushCreateProperty(
						j, prop, watchOption, webpackProperties.watchOptions[watchOption]
					);
				} else {
					throw new Error('Unknown Property', watchOption);
				}
			});
		});
	}
	if(webpackProperties['watchOptions']) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(null, p, createWatchOptionsProperty));
	} else {
		return ast;
	}
};
