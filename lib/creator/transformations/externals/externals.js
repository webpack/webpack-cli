const transformUtils = require('../../../transformations/utils');


/*
*
* Transform for externals. Finds the externals property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createExternalProperty(p) {
		if(webpackProperties.externals instanceof RegExp || typeof(webpackProperties.externals) === 'string') {
			let stringProp = webpackProperties.externals instanceof RegExp ?
			j.literal(webpackProperties.externals) :
			transformUtils.createIdentifierOrLiteral(j, webpackProperties.externals);

			return p.value.properties.push(
				transformUtils.createPropertyWithSuppliedProperty(
					j, 'externals', stringProp
				)
			);
		}
		else if(Array.isArray(webpackProperties.externals)) {
			const externalArray = transformUtils.createEmptyArrayProperty(j, 'externals');
			webpackProperties.externals.forEach( (n) => {
				// [{myprop: 'hello'}]
				let objectOfArray = j.objectExpression([]);
				if(typeof(n) !== 'string') {
					for(let key in n) {
						objectOfArray.properties.push(
							transformUtils.createPropertyWithSuppliedProperty(
								j, key, transformUtils.createIdentifierOrLiteral(j, n[key]))
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
					transformUtils.createPropertyWithSuppliedProperty(
						j, 'externals', j.objectExpression([])
					)
			);
			let externalsProp = p.value.properties;
			externalsProp.filter(n =>
				(transformUtils.safeTraverse(n, ['key', 'name']) === 'externals')
			).forEach( (prop) => {
				Object.keys(webpackProperties['externals']).forEach( (webpackProp) => {
					if(Array.isArray(webpackProperties.externals[webpackProp])) {
						// if we got a type, we make it an array
						const externalArray = transformUtils.createArrayWithChildren(
							j, webpackProp, webpackProperties.externals[webpackProp], true
						);
						prop.value.properties.push(externalArray);
					}
					else if(typeof(webpackProperties.externals[webpackProp]) === 'string') {
						prop.value.properties.push(
							transformUtils.createPropertyWithSuppliedProperty(
								j,
								webpackProp,
								transformUtils.createIdentifierOrLiteral(
									j, webpackProperties.externals[webpackProp]
								)
							)
						);
					}
					else {
						prop.value.properties.push(
							transformUtils.createPropertyWithSuppliedProperty(
								j, webpackProp, j.objectExpression([])
							)
						);
						prop.value.properties
						.filter(n =>
							(transformUtils.safeTraverse(n, ['key', 'name']) === webpackProp)
						)
						.forEach( (externalProp) => {
							Object.keys(webpackProperties.externals[webpackProp]).forEach( (subProps) => {
								if(Array.isArray(webpackProperties.externals[webpackProp][subProps])) {
									const subExternalArray = transformUtils.createArrayWithChildren(
										j, subProps, webpackProperties.externals[webpackProp][subProps], true
									);
									externalProp.value.properties.push(subExternalArray);
								} else {
									externalProp.value.properties.push(
										transformUtils.createPropertyWithSuppliedProperty(
											j,
											subProps,
											transformUtils.createIdentifierOrLiteral(
												j, webpackProperties.externals[webpackProp][subProps]
											)
										)
									);
								}
							});
						});
					}
				});
			});
		}
	}
	if(webpackProperties['externals']) {
		return ast.find(j.ObjectExpression)
		.filter(p => transformUtils.safeTraverse(p , ['parent', 'value', 'left', 'property', 'name']) === 'exports')
		.forEach(createExternalProperty);
	} else {
		return ast;
	}
};
