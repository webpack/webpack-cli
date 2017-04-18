const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createExternalProperty(p) {
		if(webpackProperties.externals instanceof RegExp) {
			return p.value.properties.push(
				j.property('init', j.identifier('externals'), j.literal(webpackProperties.externals))
			);
		}
		else if(typeof(webpackProperties.externals) === 'string') {
			return p.value.properties.push(
				j.property(
					'init',
					j.identifier('externals'),
					transformUtils.createIdentifierOrLiteral(j, webpackProperties.externals)
				)
			);
		}
		else if(Array.isArray(webpackProperties.externals)) {
			const externalArray = j.property(
				'init',
				j.identifier('externals'),
				j.arrayExpression([])
			);
			webpackProperties.externals.forEach( (n) => {
				// [{myprop: 'hello'}]
				let objectOfArray = j.objectExpression([]);
				if(typeof(n) !== 'string') {
					for(let key in n) {
						objectOfArray.properties.push(
							j.property(
								'init',
								j.identifier(key),
								transformUtils.createIdentifierOrLiteral(j, n[key])
							)
						);
					}
					externalArray.value.elements.push(objectOfArray);
				} else {
					// [val]
					return externalArray.value.elements.push(transformUtils.createIdentifierOrLiteral(j, n));
				}
			});
			return p.value.properties.push(externalArray);
		}
		else {
			p.value.properties.push(
				j.property('init', j.identifier('externals'), j.objectExpression([]))
			);
		}
		let externalsProp = p.value.properties;
		externalsProp.filter(n => n.key.name === 'externals').forEach( (prop) => {
			Object.keys(webpackProperties['externals']).forEach( (webpackProp) => {
				if(Array.isArray(webpackProperties.externals[webpackProp])) {
					// if we got a type, we make it an array
					const externalArray = j.property(
						'init',
						j.identifier(webpackProp),
						j.arrayExpression([])
					);

					webpackProperties.externals[webpackProp].forEach( (n) => {
						return externalArray.value.elements.push(j.identifier(n));
					});

					prop.value.properties.push(externalArray);
				}
				else if(typeof(webpackProperties.externals[webpackProp]) === 'string') {
					prop.value.properties.push(
						j.property(
							'init',
							j.identifier(webpackProp),
							j.identifier(webpackProperties.externals[webpackProp]))
					);
				}
				else {
					prop.value.properties.push(
						j.property('init', j.identifier(webpackProp), j.objectExpression([]))
					);
					prop.value.properties.forEach( (externalProp) => {
						if(externalProp.key.name === webpackProp) {

							Object.keys(webpackProperties.externals[webpackProp]).forEach( (subProps) => {
								if(Array.isArray(webpackProperties.externals[webpackProp][subProps])) {
									const subExternalArray = j.property(
										'init',
										j.identifier(subProps),
										j.arrayExpression([])
									);

									webpackProperties.externals[webpackProp][subProps].forEach( (n) => {
										return subExternalArray.value.elements.push(j.identifier(n));
									});
									externalProp.value.properties.push(subExternalArray);
								} else {
									externalProp.value.properties.push(
										j.property(
											'init',
											j.identifier(subProps),
											j.identifier(
												webpackProperties.externals[webpackProp][subProps]
											)
										)
									);
								}
							});
						}
					});
				}
			});
		});
	}
	if(webpackProperties['externals']) {
		return ast.find(j.ObjectExpression)
		.filter(p => transformUtils.safeTraverse(p , ['parent', 'value', 'left', 'property', 'name']) === 'exports')
		.forEach(createExternalProperty);
	} else {
		return ast;
	}
};
