const webpackModuleTypes = require('./module-types');

module.exports = function(j, ast, webpackProperties) {
	function createModuleProperties(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(j.property('init', j.identifier('module'), j.literal('null')));
			p.value.properties.filter( node => node.key.name === 'module').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.module).forEach( (webpackProp) => {
					if(['noParse', 'rules'].includes(webpackProp)) {
						if(webpackProperties.module[webpackProp].__paths) {
							let RegExpDec = webpackProperties.module[webpackProp].__paths[0].value.program.body[0].expression;
							prop.value.properties.push(
								j.property('init', j.identifier(webpackProp), j.literal(RegExpDec.value))
							);
						}
						else if(Array.isArray(webpackProperties.module[webpackProp])) {
							const moduleArray = j.property('init', j.identifier(webpackProp), j.arrayExpression([]));
							prop.value.properties.push(moduleArray);
							let seen = -1;
							webpackProperties.module[webpackProp].forEach( (subProps) => {
								prop.value.properties.filter(n => n.key.name === webpackProp).forEach( moduleProp => {
									for(let key in subProps) {
										if(webpackModuleTypes.includes(key)) {
											if(key === 'test') {
												moduleProp.value.elements.push(j.objectExpression([]));
												seen += 1;
												if(subProps[key].__paths) {
													moduleProp.value.elements[seen].properties.push(
														j.property(
															'init',
															j.identifier(key),
															j.literal(
																subProps[key].__paths[0].value.program.body[0].expression.value
															)
														)
													);
												} else {
													moduleProp.value.elements[seen].properties.push(
														j.property(
															'init',
															j.identifier(key),
															j.literal(
																subProps[key]
															)
														)
													);
												}
											}
											if(key === 'enforce') {
												moduleProp.value.elements[seen].properties.push(
													j.property('init', j.identifier(key), j.literal(subProps[key]))
												);
											}
											if(key === 'loader') {
												moduleProp.value.elements[seen].properties.push(
													j.property('init', j.identifier(key), j.literal(subProps[key]))
												);
											}
											if(key === 'options') {
												let optionVal = j.property('init', j.identifier(key), j.identifier('presets'));
												optionVal.value.type = 'ObjectExpression';
												optionVal.value.properties = [];

												Object.keys(subProps[key]).forEach( (optionProperty) => {
													if(Array.isArray(subProps[key][optionProperty])) {
														const optionArray = j.property(
															'init',
															j.identifier(optionProperty),
															j.arrayExpression([])
														);
														subProps[key][optionProperty].forEach( (n) => {
															optionArray.value.elements.push(j.literal(n));
														});
														optionVal.value.properties.push(optionArray);
													} else {
														optionVal.value.properties.push(
															j.property(
																'init',
																j.identifier(optionProperty),
																j.literal(key[optionProperty])
															)
														);
													}
												});
												moduleProp.value.elements[seen].properties.push(optionVal);
											}
											if(key === 'use') {
												let UseVal = j.property('init', j.identifier(key), j.arrayExpression([]));

												Object.keys(subProps[key]).forEach( (optionProperty) => {
													if(typeof(subProps[key][optionProperty]) === 'string') {
														UseVal.value.elements.push(j.literal(subProps[key][optionProperty]));
													} else {
														let loaderProperty = j.objectExpression([]);

														Object.keys(subProps[key][optionProperty]).forEach( subOptionProp => {
															if(typeof(subProps[key][optionProperty][subOptionProp]) === 'string') {
																loaderProperty.properties.push(
																	j.property('init',
																	j.identifier(subOptionProp),
																	j.literal(subProps[key][optionProperty][subOptionProp])
																)
															);
															} else {
																let subSubProps = j.objectExpression([]);
																Object.keys(subProps[key][optionProperty][subOptionProp]).forEach( (underlyingOption) => {
																	subSubProps.properties.push(
																		j.property('init',
																		j.identifier(underlyingOption),
																		j.literal(
																			subProps[key][optionProperty][subOptionProp][underlyingOption]
																		)
																	)
																);
																});
																loaderProperty.properties.push(j.property('init', j.identifier(subOptionProp), subSubProps));
															}
														});
														UseVal.value.elements.push(loaderProperty);
													}
												});
												moduleProp.value.elements[seen].properties.push(UseVal);
											}
											if(key === 'oneOf') {
												// TODO
											}
											if(key === 'rules') {
												// TODO
											}
											if(key === 'resource') {
												// TODO
											}
											if(key === 'include' || key === 'exclude') {
												let InExcludeVal = j.property('init', j.identifier(key), j.arrayExpression([]));
												Object.keys(subProps[key]).forEach( (subProperty) => {
													if(subProps[key][subProperty].__paths) {
														let pathVar = subProps[key][subProperty].__paths[0].value.program.body[0].expression;
														InExcludeVal.value.elements.push(pathVar);
													} else {
														InExcludeVal.value.elements.push(j.literal(subProps[key][subProperty]));
													}
												});
												moduleProp.value.elements[seen].properties.push(InExcludeVal);
											}
										}
									}
								});
							});
						}
					}
				});
			});
		}
	}
	if(!webpackProperties['module']) {
		return ast;
	} else if(webpackProperties['module'].length) {
		throw new Error('Supplying output with only no options is not supported.');
	} else {
		return ast.find(j.ObjectExpression).filter(p => createModuleProperties(p));
	}
};
