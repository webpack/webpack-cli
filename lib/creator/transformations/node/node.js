module.exports = function(j, ast, webpackProperties) {
	function createNodeProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(j.property('init', j.identifier('node'), j.literal('null')));
			p.value.properties.filter(node => node.key.name === 'node').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.node).forEach( (webpackProp) => {
					prop.value.properties.push(
						j.property('init', j.identifier(webpackProp), j.literal(webpackProperties.node[webpackProp]))
					);
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
