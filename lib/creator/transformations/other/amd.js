module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createAMDProperty(p) {
		let amdNode = p.value.properties;
		amdNode.push(j.property('init', j.identifier('amd'), j.objectExpression([])));
		amdNode.filter(n => n.key.name === 'amd').forEach( (prop) => {
			Object.keys(webpackProperties['amd']).forEach( (webpackProp) => {
				if(typeof(webpackProperties.amd[webpackProp]) === 'boolean') {
					prop.value.properties.push(
						j.property(
							'init',
							j.identifier(webpackProp),
							j.literal(webpackProperties.amd[webpackProp])
						)
					);
				} else {
					prop.value.properties.push(
						j.property(
							'init',
							j.identifier(webpackProp),
							j.identifier(webpackProperties.amd[webpackProp])
						)
					);
				}
			});
		});
	}
	if(webpackProperties['amd'] && typeof(webpackProperties['amd']) === 'object') {
		return ast.find(j.ObjectExpression)
		.filter(p => createAMDProperty(p));
	} else {
		return ast;
	}
};
