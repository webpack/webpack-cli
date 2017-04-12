module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createNodeProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(j.property('init', j.identifier('node'), j.literal('null')));
			p.value.properties.filter(node => node.key.name === 'node').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.node).forEach( (webpackProp) => {
					if(typeof(webpackProperties.node[webpackProp]) === 'boolean') {
						prop.value.properties.push(
							j.property('init', j.identifier(webpackProp), j.literal(webpackProperties.node[webpackProp]))
						);
					} else {
						prop.value.properties.push(
							j.property('init', j.identifier(webpackProp), j.identifier(webpackProperties.node[webpackProp]))
						);
					}
				});
			});
		}
	}
	if(webpackProperties['node'] && typeof(webpackProperties['node']) === 'object') {
		return ast.find(j.ObjectExpression).filter(p => createNodeProperty(p));
	} else {
		return ast;
	}
};
