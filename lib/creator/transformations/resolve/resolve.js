const resolveTypes = require('./resolve-types');
const isAssignment = require('../../utils/is-assignment');
const utils = require('../../../transformations/utils');

/*
*
* Transform for resolve. Finds the resolve property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createResolveProperties(p) {
		utils.pushCreateProperty(j, p, 'resolve', j.objectExpression([]));
		let resolveNode = p.value.properties;
		resolveNode.filter(n => n.key.name === 'resolve').forEach( (prop) => {
			Object.keys(webpackProperties.resolve).forEach( (webpackProp) => {
				if(resolveTypes.includes(webpackProp) || webpackProp === 'resolveLoader') {
					if(Array.isArray(webpackProperties.resolve[webpackProp])) {
						// if we got a type, we make it an array
						const resolveArray = utils.createArrayWithChildren(
							j, webpackProp, webpackProperties.resolve[webpackProp], true
						);
						prop.value.properties.push(resolveArray);
					}
					else if(typeof(webpackProperties.resolve[webpackProp]) === 'boolean') {
						utils.pushCreateProperty(
							j, prop, webpackProp, webpackProperties.resolve[webpackProp]
						);
					}
					else {
						utils.pushCreateProperty(j, prop, webpackProp, j.objectExpression([]));
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
										const resolveLoaderArray = utils.createArrayWithChildren(
											j, aliasProps, webpackProperties.resolve[webpackProp][aliasProps], true
										);
										resolveProp.value.properties.push(resolveLoaderArray);

									} else if(webpackProperties.resolve[webpackProp][aliasProps].length > 1) {
										if(aliasProps.indexOf('inject') >= 0) {
											resolveProp.value.properties.push(j.identifier(
												webpackProperties.resolve[webpackProp][aliasProps]
											));
										} else {
											utils.pushCreateProperty(
												j, resolveProp, aliasProps, webpackProperties.resolve[webpackProp][aliasProps]
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
