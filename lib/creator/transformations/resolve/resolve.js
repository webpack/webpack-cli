const resolveTypes = require('./resolve-types');
const isAssignment = require('../../utils/is-assignment');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createResolveProperties(p) {
		let resolveNode = p.value.properties;
		resolveNode.push(j.property('init', j.identifier('resolve'), j.objectExpression([])));
		resolveNode.filter(n => n.key.name === 'resolve').forEach( (prop) => {
			Object.keys(webpackProperties.resolve).forEach( (webpackProp) => {
				if(resolveTypes.includes(webpackProp) || webpackProp === 'resolveLoader') {
					if(Array.isArray(webpackProperties.resolve[webpackProp])) {
						// if we got a type, we make it an array
						const resolveArray = j.property('init', j.identifier(webpackProp), j.arrayExpression([]));
						webpackProperties.resolve[webpackProp].forEach( (n) => {
							return resolveArray.value.elements.push(j.identifier(n));
						});
						prop.value.properties.push(resolveArray);
					}
					else if(typeof(webpackProperties.resolve[webpackProp]) === 'boolean') {
						let boolExp = j.property(
							'init',
							j.identifier(webpackProp),
							j.literal(webpackProperties.resolve[webpackProp])
						);
						prop.value.properties.push(boolExp);
					}
					else {
						prop.value.properties.push(
							j.property(
								'init',
								j.identifier(webpackProp),
								j.objectExpression([]))
							);
						prop.value.properties.forEach( (resolveProp) => {
							if(resolveProp.key.name === webpackProp) {
								if(resolveProp.key.name === 'cachePredicate') {
									let cachePredicateVal =
									(typeof webpackProperties.resolve[webpackProp] === 'string') ?
									j.identifier(webpackProperties.resolve[webpackProp]) :
									j.literal(webpackProperties.resolve[webpackProp]);
									resolveProp.value = cachePredicateVal;
								}
								Object.keys(webpackProperties.resolve[webpackProp]).forEach( (aliasProps) => {
									if(Array.isArray(webpackProperties.resolve[webpackProp][aliasProps])) {
										const resolveLoaderArray = j.property(
											'init',
											j.identifier(aliasProps),
											j.arrayExpression([])
										);
										webpackProperties.resolve[webpackProp][aliasProps].forEach( (n) => {
											return resolveLoaderArray.value.elements.push(j.identifier(n));
										});
										resolveProp.value.properties.push(resolveLoaderArray);

									} else if(webpackProperties.resolve[webpackProp][aliasProps].length > 1) {
										if(aliasProps.indexOf('inject') >= 0) {
											resolveProp.value.properties.push(j.identifier(
												webpackProperties.resolve[webpackProp][aliasProps]
											));
										} else {
											resolveProp.value.properties.push(
												j.property(
													'init',
													j.identifier(aliasProps),
													j.identifier(webpackProperties.resolve[webpackProp][aliasProps])
												)
											);
										}
									}
								});
							}
						});
					}
				}
			});
		});
	}
	if(webpackProperties['resolve'] ) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createResolveProperties));
	}
	else {
		return ast;
	}
};
