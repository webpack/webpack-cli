module.exports = function(j, ast, webpackProperties) {
	function createExternalProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			if(webpackProperties.externals instanceof RegExp) {
				return p.value.properties.push(j.property('init', j.identifier('externals'), j.literal(webpackProperties.externals)));
			}
			else if(webpackProperties.externals.__paths) {
				let RegExpDec = webpackProperties.externals.__paths[0].value.program.body[0].expression.rawValue;
				return p.value.properties.push(j.property('init', j.identifier('externals'), j.literal(RegExpDec)));
			} else {
				p.value.properties.push(j.property('init', j.identifier('externals'), j.literal('null')));
			}
			p.value.properties.filter(node => node.key.name === 'externals').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.externals).forEach( (webpackProp) => {
					if(Array.isArray(webpackProperties.externals[webpackProp])) {
						// if we got a type, we make it an array
						const externalArray = j.property('init', j.identifier(webpackProp), j.arrayExpression([]));
						webpackProperties.externals[webpackProp].forEach( (n) => {
							if(n.__paths) {
								externalArray.value.elements.push(
									n.__paths[0].value.program.body[0]
								);
							} else {
								return externalArray.value.elements.push(j.literal(n));
							}
						});
						prop.value.properties.push(externalArray);
					}
					else if(typeof(webpackProperties.externals[webpackProp]) === 'string') {
						prop.value.properties.push(j.property('init', j.identifier(webpackProp), j.literal(webpackProperties.externals[webpackProp])));
					}
					else if(webpackProperties.externals[webpackProp].__paths) {
						let funcDec = webpackProperties.externals[webpackProp].__paths[0].value.program.body[0];
						prop.value.type = 'ArrayExpression';
						prop.value.elements = [];
						prop.value.elements.push(funcDec);
					}
					else {
						prop.value.properties.push(j.property('init', j.identifier(webpackProp), j.literal('null')));
						prop.value.properties.forEach( (externalProp) => {
							if(externalProp.key.name === webpackProp) {
								externalProp.value.type = 'ObjectExpression';
								externalProp.value.properties = [];
								Object.keys(webpackProperties.externals[webpackProp]).forEach( (subProps) => {
									if(Array.isArray(webpackProperties.externals[webpackProp][subProps])) {
										const subExternalArray = j.property('init', j.identifier(subProps), j.arrayExpression([]));
										webpackProperties.externals[webpackProp][subProps].forEach( (n) => {
											return subExternalArray.value.elements.push(j.literal(n));
										});
										externalProp.value.properties.push(subExternalArray);
									} else {
										externalProp.value.properties.push(
											j.property('init', j.identifier(subProps), j.literal(webpackProperties.externals[webpackProp][subProps]))
										);
									}
								});
							}
						});
					}
				});
			});
		}
	}
	if(webpackProperties['externals'] && typeof webpackProperties['externals'] === 'object') {
		return ast.find(j.ObjectExpression).filter(p => createExternalProperty(p));
	} else {
		return ast;
	}
};
