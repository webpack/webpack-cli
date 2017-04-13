const webpackModuleTypes = require('./module-types');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
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
										if(key.indexOf('inject') >= 0) {
											moduleProp.value.elements.push(subProps[key]);
											seen += 1;
										}
										if(webpackModuleTypes.includes(key)) {
											if(key === 'test') {
												moduleProp.value.elements.push(j.objectExpression([]));
												seen += 1;
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
											if(key === 'enforce') {
												moduleProp.value.elements[seen].properties.push(
													j.property('init', j.identifier(key), j.identifier(subProps[key]))
												);
											}
											if(key === 'loader') {
												moduleProp.value.elements[seen].properties.push(
													j.property('init', j.identifier(key), j.identifier(subProps[key]))
												);
											}
											if(key === 'options') {
												let optionVal = j.property('init', j.identifier(key), j.identifier('presets'));

												if(typeof(subProps[key]) === 'string') {
													optionVal.value = j.identifier(subProps[key]);
												} else {
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
															if(typeof(subProps[key][optionProperty]) === 'string') {
																optionVal.value.properties.push(
																	j.property(
																		'init',
																		j.identifier(optionProperty),
																		j.identifier(subProps[key][optionProperty])
																	)
																);
															} else {
																optionVal.value.properties.push(
																	j.property(
																		'init',
																		j.identifier(optionProperty),
																		j.literal(subProps[key][optionProperty])
																	)
																);
															}
														}
													});
												}
												moduleProp.value.elements[seen].properties.push(optionVal);
											}
											if(key === 'use') {
												let UseVal = j.property('init', j.identifier(key), j.arrayExpression([]));

												Object.keys(subProps[key]).forEach( (optionProperty) => {
													if(typeof(subProps[key][optionProperty]) === 'string') {
														UseVal.value.elements.push(j.identifier(subProps[key][optionProperty]));
													} else {
														let loaderProperty = j.objectExpression([]);

														Object.keys(subProps[key][optionProperty]).forEach( subOptionProp => {
															if(typeof(subProps[key][optionProperty][subOptionProp]) === 'string') {
																loaderProperty.properties.push(
																	j.property('init',
																	j.identifier(subOptionProp),
																	j.identifier(subProps[key][optionProperty][subOptionProp])
																)
															);
															} else {
																let subSubProps = j.objectExpression([]);
																Object.keys(subProps[key][optionProperty][subOptionProp]).forEach( (underlyingOption) => {
																	subSubProps.properties.push(
																		j.property('init',
																		j.identifier(underlyingOption),
																		j.identifier(
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
													InExcludeVal.value.elements.push(j.identifier(subProps[key][subProperty]));
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
