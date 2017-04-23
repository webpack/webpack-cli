const resolveTypes = require('./resolve-types');
const utils = require('../../../transformations/utils');

/*
*
* Transform for resolve. Finds the resolve property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createResolveProperties(p) {
		utils.pushCreateProperty(j, p, 'resolve', j.objectExpression([]));
		let resolveNode = p.value.properties;
		resolveNode.filter(n => n.key.name === 'resolve').forEach( (prop) => {
			Object.keys(webpackProperties).forEach( (webpackProp) => {
				if(resolveTypes.includes(webpackProp) || webpackProp === 'resolveLoader') {
					if(Array.isArray(webpackProperties[webpackProp])) {
						// if we got a type, we make it an array
						const resolveArray = utils.createArrayWithChildren(
							j, webpackProp, webpackProperties[webpackProp], true
						);
						prop.value.properties.push(resolveArray);
					}
					else if(typeof(webpackProperties[webpackProp]) === 'boolean') {
						utils.pushCreateProperty(
							j, prop, webpackProp, webpackProperties[webpackProp]
						);
					}
					else {
						utils.pushCreateProperty(j, prop, webpackProp, j.objectExpression([]));
						prop.value.properties.forEach( (resolveProp) => {
							if(resolveProp.key.name === webpackProp) {
								if(resolveProp.key.name === 'cachePredicate') {
									let cachePredicateVal =
									(typeof webpackProperties[webpackProp] === 'string') ?
									j.identifier(webpackProperties[webpackProp]) :
									j.literal(webpackProperties[webpackProp]);
									resolveProp.value = cachePredicateVal;
								}
								Object.keys(webpackProperties[webpackProp]).forEach( (aliasProps) => {
									if(Array.isArray(webpackProperties[webpackProp][aliasProps])) {
										const resolveLoaderArray = utils.createArrayWithChildren(
											j, aliasProps, webpackProperties[webpackProp][aliasProps], true
										);
										resolveProp.value.properties.push(resolveLoaderArray);

									} else if(webpackProperties[webpackProp][aliasProps].length > 1) {
										if(aliasProps.indexOf('inject') >= 0) {
											resolveProp.value.properties.push(j.identifier(
												webpackProperties[webpackProp][aliasProps]
											));
										} else {
											utils.pushCreateProperty(
												j, resolveProp, aliasProps, webpackProperties[webpackProp][aliasProps]
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
	if(webpackProperties) {
		return ast.find(j.ObjectExpression).filter(p => utils.isAssignment(null, p, createResolveProperties));
	}
	else {
		return ast;
	}
};
