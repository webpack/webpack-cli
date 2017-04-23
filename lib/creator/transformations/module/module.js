const webpackModuleTypes = require('./module-types');
const isAssignment = require('../../utils/is-assignment');
const localUtils = require('./utils');
const utils = require('../../../transformations/utils');


/*
*
* Transform for module. Finds the module property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createModuleProperties(p) {
		utils.pushCreateProperty(j, p, 'module', j.objectExpression([]));
		let moduleNode = p.value.properties;
		moduleNode.filter(n =>
			(utils.safeTraverse(n, ['key', 'name']) === 'module')
		).forEach( (prop) => {
			Object.keys(webpackProperties['module'])
			.forEach( (webpackProp) => {
				if(['noParse', 'rules'].includes(webpackProp)) {
					if(webpackProperties.module[webpackProp].__paths) {
						// optional if user can't use regular regexp
						localUtils.regExpStrategy(j, webpackProperties, webpackProp, prop);
					}
					else if(Array.isArray(webpackProperties.module[webpackProp])) {
						const rulesArray = utils.createEmptyArrayProperty(j, webpackProp);
						prop.value.properties.push(rulesArray);
						// Keeps track of what object we're refering to when adding props
						let seen = -1;
						let rulesProperties = webpackProperties.module[webpackProp];

						rulesProperties
						.forEach( (subProps) => {
							let rulesMatchProp = prop.value.properties.filter(n =>
								(utils.safeTraverse(n, ['key', 'name']) === webpackProp)
							);
							rulesMatchProp.forEach( moduleProp => {
								for(let key in subProps) {
									if(key.indexOf('inject') >= 0) {
										moduleProp.value.elements.push(
											subProps[key]
										);
										seen += 1;
									}
									if(webpackModuleTypes.includes(key)) {
										if(key === 'test') {
											moduleProp.value.elements.push(
												j.objectExpression([])
											);
											seen += 1;
											localUtils.createTestProperty(
												j, moduleProp, seen, key, subProps
											);
										}
										if(key === 'enforce' || key === 'loader') {
											moduleProp.value.elements[seen].properties.push(
												utils.createPropertyWithSuppliedProperty(
													j,
													key,
													utils.createIdentifierOrLiteral(
														j, subProps[key]
													)
												)
											);
										}
										if(key === 'options' || key === 'use') {
											const subProperties = (key === 'use') ?
											localUtils.createUseProperties(j, key, subProps) :
											localUtils.createOption(j, subProps, key);
											moduleProp.value.elements[seen].properties.push(
												subProperties
											);
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
											moduleProp.value.elements[seen].properties.push(
												utils.createArrayWithChildren(j, key, subProps)
											);
										}
									}
								}
							});
						});
					} else {
						return utils.pushCreateProperty(
							j, prop, webpackProp, webpackProperties.module[webpackProp]
						);
					}
				}
			});
		});
	}
	if(!webpackProperties['module']) {
		return ast;
	} else {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(null, p, createModuleProperties));
	}
};
