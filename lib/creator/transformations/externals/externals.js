const utils = require('../../../transformations/utils');


/*
*
* Transform for externals. Finds the externals property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createExternalProperty(p) {
		if(webpackProperties instanceof RegExp || typeof(webpackProperties) === 'string') {
			return utils.pushCreateProperty(j, p, 'externals', webpackProperties);
		}
		else if(Array.isArray(webpackProperties)) {
			const externalArray = utils.createEmptyArrayProperty(j, 'externals');
			webpackProperties.forEach( (n) => {
				// [{myprop: 'hello'}]
				let objectOfArray = j.objectExpression([]);
				if(typeof(n) !== 'string') {
					for(let key in n) {
						objectOfArray.properties.push(
							utils.createObjectWithSuppliedProperty(
								j, key, utils.createIdentifierOrLiteral(j, n[key]))
						);
					}
					externalArray.value.elements.push(objectOfArray);
				} else {
					// [val]
					return externalArray.value.elements.push(utils.createIdentifierOrLiteral(j, n));
				}
			});
			return p.value.properties.push(externalArray);
		}
		else {
			utils.pushCreateProperty(j, p, 'externals', j.objectExpression([]));
			let externalsProp = p.value.properties;
			externalsProp.filter(n =>
				(utils.safeTraverse(n, ['key', 'name']) === 'externals')
			).forEach( (prop) => {
				Object.keys(webpackProperties).forEach( (webpackProp) => {
					if(Array.isArray(webpackProperties[webpackProp])) {
						// if we got a type, we make it an array
						const externalArray = utils.createArrayWithChildren(
							j, webpackProp, webpackProperties[webpackProp], true
						);
						prop.value.properties.push(externalArray);
					}
					else if(typeof(webpackProperties[webpackProp]) === 'string') {
						utils.pushCreateProperty(
							j, prop, webpackProp, webpackProperties[webpackProp]
						);
					}
					else {
						utils.pushCreateProperty(
							j, prop, webpackProp, j.objectExpression([])
						);
						prop.value.properties
						.filter(n =>
							(utils.safeTraverse(n, ['key', 'name']) === webpackProp)
						)
						.forEach( (externalProp) => {
							Object.keys(webpackProperties[webpackProp]).forEach( (subProps) => {
								if(Array.isArray(webpackProperties[webpackProp][subProps])) {
									const subExternalArray = utils.createArrayWithChildren(
										j, subProps, webpackProperties[webpackProp][subProps], true
									);
									externalProp.value.properties.push(subExternalArray);
								} else {
									utils.pushCreateProperty(
										j, externalProp, subProps, webpackProperties[webpackProp][subProps]
									);
								}
							});
						});
					}
				});
			});
		}
	}
	if(webpackProperties) {
		return ast.find(j.ObjectExpression)
		.filter(p => utils.safeTraverse(p , ['parent', 'value', 'left', 'property', 'name']) === 'exports')
		.forEach(createExternalProperty);
	} else {
		return ast;
	}
};
