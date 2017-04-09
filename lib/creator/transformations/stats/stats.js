const utils = require('../../../transformations/utils');
const statsTypes = require('./stats-types');
/*
safeTraverse,
createProperty,
findPluginsByName,
findPluginsRootNodes,
createOrUpdatePluginByName,
findVariableToPlugin,
isType,
createLiteral,
findObjWithOneOfKeys,
getRequire
*/

module.exports = function(j, ast, webpackProperties) {
	function createStatsProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(utils.createProperty(j, 'stats', null));
			p.value.properties.filter(node => node.key.value === 'stats').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.stats).forEach( (webpackProp) => {
					if(statsTypes.includes(webpackProp)) {
						if(Array.isArray(webpackProperties.stats[webpackProp])) {
							const statsArray = j.property('init', j.identifier(webpackProp), j.arrayExpression([]));
							webpackProperties.stats[webpackProp].forEach( (n) => {
								return statsArray.value.elements.push(j.literal(n));
							});
							prop.value.properties.push(statsArray);
						}
						else {
							prop.value.properties.push(utils.createProperty(j, webpackProp, webpackProperties.stats[webpackProp]));
						}
					} else {
						throw new Error('Unknown Property', webpackProp);
					}
				});
			});
		}
	}
	if(webpackProperties['stats'] && typeof(webpackProperties['stats']) === 'object') {
		return ast.find(j.ObjectExpression).filter(p => createStatsProperty(p));
	}
	else if(webpackProperties['stats'] && webpackProperties['stats'].length) {
		return ast.find(j.ObjectExpression).filter(p => {
			if(p.parent.value.type === 'AssignmentExpression')
				return p.value.properties.push(utils.createProperty(j, 'stats', webpackProperties['stats']));

		});
	} else {
		return ast;
	}
};
