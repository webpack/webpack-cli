const statsTypes = require('./stats-types');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createStatsProperty(p) {
		let statsNode = p.value.properties;
		statsNode.push(j.property('init', j.identifier('stats'), j.objectExpression([])));
		statsNode.filter(n => n.key.name === 'stats');
		statsNode.forEach( (prop) => {
			Object.keys(webpackProperties.stats).forEach( (webpackProp) => {
				if(statsTypes.includes(webpackProp)) {
					if(Array.isArray(webpackProperties.stats[webpackProp])) {
						const statsArray = j.property('init', j.identifier(webpackProp), j.arrayExpression([]));
						webpackProperties.stats[webpackProp].forEach( (n) => {
							return statsArray.value.elements.push(j.identifier(n));
						});
						prop.value.properties.push(statsArray);
					}
					else {
						prop.value.properties.push(
							j.property(
								'init',
								j.identifier(webpackProp),
								j.identifier(webpackProperties.stats[webpackProp])
							)
						);
					}
				} else {
					throw new Error('Unknown Property', webpackProp);
				}
			});
		});
	}
	if(webpackProperties['stats'] && typeof(webpackProperties['stats']) === 'object') {
		return ast.find(j.ObjectExpression).filter(p => createStatsProperty(p));
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
