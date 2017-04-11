const resolveTypes = require('./resolve-types');

module.exports = function(j, ast, webpackProperties) {
	function createResolveProperties(p) {
		if(webpackProperties['resolve']) {
			if(p.parent.value.type === 'AssignmentExpression') {
				p.value.properties.push(j.property('init', j.identifier('resolve'), j.literal('null')));
			}
			p.value.properties.filter(node => node.key.name === 'resolve').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.resolve).forEach( (webpackProp) => {
					if(resolveTypes.includes(webpackProp) || webpackProp === 'resolveLoader') {
						if(Array.isArray(webpackProperties.resolve[webpackProp])) {
							// if we got a type, we make it an array
							const resolveArray = j.property('init', j.identifier(webpackProp), j.arrayExpression([]));
							webpackProperties.resolve[webpackProp].forEach( (n) => {
								if(n.__paths) {
									let pluginExp = n.__paths[0].value.program.body[0].expression;
									return resolveArray.value.elements.push(pluginExp);
								} else {
									return resolveArray.value.elements.push(j.literal(n));
								}
							});
							prop.value.properties.push(resolveArray);
						}
						else if(typeof(webpackProperties.resolve[webpackProp]) === 'boolean') {
							let boolExp = j.property('init', j.identifier(webpackProp), j.literal(webpackProperties.resolve[webpackProp]));
							prop.value.properties.push(boolExp);
						} else if(webpackProperties.resolve[webpackProp].__paths) {
							let funcDec = webpackProperties.resolve[webpackProp].__paths[0].value.program.body[0];
							prop.value.properties.push(j.property('init', j.identifier(webpackProp), j.literal('null')));
							prop.value.properties.filter(node => node.key.name === webpackProp).forEach( (funcProp) => {
								funcProp.value = funcDec;
							});
						}
						else {
							prop.value.properties.push(j.property('init', j.identifier(webpackProp), j.literal('null')));
							prop.value.properties.forEach( (resolveProp) => {
								if(resolveProp.key.name === webpackProp) {
									resolveProp.value.type = 'ObjectExpression';
									resolveProp.value.properties = [];
									Object.keys(webpackProperties.resolve[webpackProp]).forEach( (aliasProps) => {
										if(Array.isArray(webpackProperties.resolve[webpackProp][aliasProps])) {
											const resolveLoaderArray = j.property('init', j.identifier(aliasProps), j.arrayExpression([]));
											webpackProperties.resolve[webpackProp][aliasProps].forEach( (n) => {
												return resolveLoaderArray.value.elements.push(j.literal(n));
											});
											resolveProp.value.properties.push(resolveLoaderArray);
										} else {
											resolveProp.value.properties.push(
											j.property('init', j.identifier(aliasProps), j.literal(webpackProperties.resolve[webpackProp][aliasProps]))
											);
										}
									});
								}
							});
						}
					}
				});
			});
		}
		else if(webpackProperties['resolve'] && webpackProperties['resolve'].length) {
			throw new Error('Resolve needs properties');
		}
		else {
			return ast;
		}
	}
	return ast.find(j.ObjectExpression).filter(p => createResolveProperties(p));
};
