const performanceTypes = require('./performance-types');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createPerformanceProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(j.property('init', j.identifier('performance'), j.literal('null')));
			p.value.properties.filter(node => node.key.name === 'performance').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
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
								prop.value.properties.push(j.property('init', j.identifier(webpackProp), j.literal(webpackProperties.performance[webpackProp])));
							}
						}
					} else {
						throw new Error('Unknown Property', webpackProp);
					}
				});
			});
		}
	}
	if(webpackProperties['performance'] && typeof(webpackProperties['performance']) === 'object') {
		return ast.find(j.ObjectExpression).filter(p => createPerformanceProperty(p));
	} else {
		return ast;
	}
};
