const statsTypes = require('./stats-types');
const isAssignment = require('../../../transformations/utils').isAssignment;
const utils = require('../../../transformations/utils');

/*
*
* Transform for stats. Finds the stats property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createStatsProperty(p) {
		utils.pushCreateProperty(j, p, 'stats', j.objectExpression([]));
		let statsNode = p.value.properties;
		statsNode.filter(n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'stats')
		).forEach( (prop) => {
			Object.keys(webpackProperties).forEach( (webpackProp) => {
				if(statsTypes.includes(webpackProp)) {
					if(Array.isArray(webpackProperties[webpackProp])) {
						const statsArray = utils.createArrayWithChildren(
							j, webpackProp, webpackProperties[webpackProp], true
						);
						prop.value.properties.push(statsArray);
					}
					else {
						utils.pushCreateProperty(
							j, prop, webpackProp, webpackProperties[webpackProp]
						);
					}
				} else {
					throw new Error('Unknown Property', webpackProp);
				}
			});
		});
	}
	if(webpackProperties && typeof(webpackProperties) === 'object') {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(null, p, createStatsProperty));
	}
	// FIXME -> HOC AssignmentExpression
	else if(webpackProperties && webpackProperties.length) {
		return ast.find(j.ObjectExpression).filter(p => {
			if(p.parent.value.type === 'AssignmentExpression') {
				return p.value.properties.push(
					j.property('init', j.identifier('stats'), j.identifier(webpackProperties))
				);
			}
		});
	} else {
		return ast;
	}
};
