const watchOptionTypes = require('./watchOptions-types');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createWatchOptionsProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(j.property('init', j.identifier('watchOptions'), j.literal('null')));
			p.value.properties.filter(node => node.key.name === 'watchOptions').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties['watchOptions']).filter( (watchOption) => {
					if(watchOptionTypes.includes(watchOption)) {
						if(typeof(webpackProperties['watchOptions'][watchOption]) === 'number') {
							prop.value.properties.push(
								j.property('init', j.identifier(watchOption), j.literal(webpackProperties['watchOptions'][watchOption]))
							);
						} else {
							prop.value.properties.push(
								j.property('init', j.identifier(watchOption), j.identifier(webpackProperties['watchOptions'][watchOption]))
							);
						}
					} else {
						throw new Error('Unknown Property', watchOption);
					}
				});
			});
		}
	}
	if(webpackProperties['watchOptions'] && webpackProperties['watchOptions']) {
		return ast.find(j.ObjectExpression).filter(p => createWatchOptionsProperty(p));
	} else {
		return ast;
	}
};
