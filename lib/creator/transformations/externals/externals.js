const utils = require('../../../transformations/utils');


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
			return utils.pushCreateProperty(j, p, 'externals', webpackProperties.externals);
		}
		else if(Array.isArray(webpackProperties.externals)) {
			const externalArray = utils.createEmptyArrayProperty(j, 'externals');
			webpackProperties.externals.forEach( (n) => {
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
				Object.keys(webpackProperties['externals']).forEach( (webpackProp) => {
					if(Array.isArray(webpackProperties.externals[webpackProp])) {
						// if we got a type, we make it an array
						const externalArray = utils.createArrayWithChildren(
							j, webpackProp, webpackProperties.externals[webpackProp], true
						);
						prop.value.properties.push(externalArray);
					}
					else if(typeof(webpackProperties.externals[webpackProp]) === 'string') {
						utils.pushCreateProperty(
							j, prop, webpackProp, webpackProperties.externals[webpackProp]
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
							Object.keys(webpackProperties.externals[webpackProp]).forEach( (subProps) => {
								if(Array.isArray(webpackProperties.externals[webpackProp][subProps])) {
									const subExternalArray = utils.createArrayWithChildren(
										j, subProps, webpackProperties.externals[webpackProp][subProps], true
									);
									externalProp.value.properties.push(subExternalArray);
								} else {
									utils.pushCreateProperty(
										j, externalProp, subProps, webpackProperties.externals[webpackProp][subProps]
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
		.filter(p => utils.safeTraverse(p , ['parent', 'value', 'left', 'property', 'name']) === 'exports')
		.forEach(createExternalProperty);
	} else {
		return ast;
	}
};
