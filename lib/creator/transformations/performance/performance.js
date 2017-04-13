const performanceTypes = require('./performance-types');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createPerformanceProperty(p) {
		let performanceNode = p.value.properties;
		performanceNode.push(j.property('init', j.identifier('performance'), j.objectExpression([])));
		performanceNode.filter(n => n.key.name === 'performance');
		performanceNode.forEach( (prop) => {
			Object.keys(webpackProperties.performance).forEach( (webpackProp) => {
				if(performanceTypes.includes(webpackProp)) {
					if(Array.isArray(webpackProperties.performance[webpackProp])) {
						throw new Error('Unknown Property', webpackProp);
					}
					else {
						if(typeof(webpackProperties.performance[webpackProp]) == 'string') {
							prop.value.properties.push(
								j.property(
									'init',
									j.identifier(webpackProp),
									j.identifier(webpackProperties.performance[webpackProp])
								)
							);
						} else {
							prop.value.properties.push(
								j.property(
									'init',
									j.identifier(webpackProp),
									j.literal(webpackProperties.performance[webpackProp])
								)
							);
						}
					}
				}
			});
		});
	}
	if(webpackProperties['performance'] && typeof(webpackProperties['performance']) === 'object') {
		return ast.find(j.ObjectExpression)
		.filter(p => createPerformanceProperty(p));
	} else {
		return ast;
	}
};
