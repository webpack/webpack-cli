const webpackOutputTypes = require('./output-types');
const isAssignment = require('../../../transformations/utils').isAssignment;
const utils = require('../../../transformations/utils');


/*
*
* Transform for output. Finds the output property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createOutputProperties(p) {
		utils.pushCreateProperty(j, p, 'output', j.objectExpression([]));
		let outputNode = p.value.properties;
		outputNode.filter( n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'output')
		).forEach( (prop) => {
			Object.keys(webpackProperties.output).forEach( (webpackProp) => {
				if(webpackOutputTypes.includes(webpackProp)) {
					if(webpackProperties.output[webpackProp].__paths) {
						let regExpProp = utils.createExternalRegExp(j, webpackProperties.output[webpackProp]);
						utils.pushCreateProperty(j, prop, webpackProp, regExpProp);
					}
					else {
						utils.pushCreateProperty(
							j, prop, webpackProp, webpackProperties.output[webpackProp]
						);
					}
				}
			});
		});
	}
	if(webpackProperties['output']) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(null, p, createOutputProperties));
	} else {
		return ast;
	}
};
