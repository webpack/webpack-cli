const watchOptionTypes = require('./watchOptions-types');
const isAssignment = require('../../../transformations/utils').isAssignment;
const utils = require('../../../transformations/utils');

/*
*
* Transform for watchOptions. Finds the watchOptions property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createWatchOptionsProperty(p) {
		utils.pushCreateProperty(j, p, 'watchOptions', j.objectExpression([]));
		p.value.properties.filter(n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'watchOptions')
		).forEach( (prop) => {
			Object.keys(webpackProperties).filter( (watchOption) => {
				if(watchOptionTypes.includes(watchOption)) {
					utils.pushCreateProperty(
						j, prop, watchOption, webpackProperties[watchOption]
					);
				} else {
					throw new Error('Unknown Property', watchOption);
				}
			});
		});
	}
	if(webpackProperties) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(null, p, createWatchOptionsProperty));
	} else {
		return ast;
	}
};
