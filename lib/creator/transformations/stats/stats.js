const statsTypes = require('./stats-types');
const isAssignment = require('../../utils/is-assignment');
const utils = require('../../../transformations/utils');

/*
*
* Transform for stats. Finds the stats property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createStatsProperty(p) {
		utils.pushCreateProperty(j, p, 'stats', j.objectExpression([]));
		let statsNode = p.value.properties;
		statsNode.filter(n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'stats')
		).forEach( (prop) => {
			Object.keys(webpackProperties.stats).forEach( (webpackProp) => {
				if(statsTypes.includes(webpackProp)) {
					if(Array.isArray(webpackProperties.stats[webpackProp])) {
						const statsArray = utils.createArrayWithChildren(
							j, webpackProp, webpackProperties.stats[webpackProp], true
						);
						prop.value.properties.push(statsArray);
					}
					else {
						utils.pushCreateProperty(
							j, prop, webpackProp, webpackProperties.stats[webpackProp]
						);
					}
				} else {
					throw new Error('Unknown Property', webpackProp);
				}
			});
		});
	}
	if(webpackProperties['stats'] && typeof(webpackProperties['stats']) === 'object') {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(null, p, createStatsProperty));
	}
	// FIXME -> HOC AssignmentExpression
	else if(webpackProperties['stats'] && webpackProperties['stats'].length) {
		return ast.find(j.ObjectExpression).filter(p => {
			if(p.parent.value.type === 'AssignmentExpression') {
				return p.value.properties.push(
					j.property('init', j.identifier('stats'), j.identifier(webpackProperties['stats']))
				);
			}
		});
	} else {
		return ast;
	}
};
