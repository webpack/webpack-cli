const webpackModuleTypes = require('./module-types');
const isAssignment = require('../../utils/is-assignment');
const localUtils = require('./utils');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createModuleProperties(p) {
		p.value.properties.push(
			transformUtils.createPropertyWithSuppliedProperty(j, 'module', j.objectExpression([]))
		);
		let moduleNode = p.value.properties;
		moduleNode.filter(n =>
			(transformUtils.safeTraverse(n, ['key', 'name']) === 'module')
		).forEach( (prop) => {
			Object.keys(webpackProperties['module'])
			.forEach( (webpackProp) => {
				if(['noParse', 'rules'].includes(webpackProp)) {
					if(webpackProperties.module[webpackProp].__paths) {
						// optional if user can't use regular regexp
						localUtils.regExpStrategy(j, webpackProperties, webpackProp, prop);
					}
					else if(Array.isArray(webpackProperties.module[webpackProp])) {
						const rulesArray = transformUtils.createEmptyArrayProperty(j, webpackProp);
						prop.value.properties.push(rulesArray);
						// Keeps track of what object we're refering to when adding props
						let seen = -1;
						let rulesProperties = webpackProperties.module[webpackProp];

						rulesProperties
						.forEach( (subProps) => {
							let rulesMatchProp = prop.value.properties.filter(n =>
								(transformUtils.safeTraverse(n, ['key', 'name']) === webpackProp)
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
												transformUtils.createPropertyWithSuppliedProperty(
													j,
													key,
													transformUtils.createIdentifierOrLiteral(
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
												transformUtils.createArrayWithChildren(j, key, subProps)
											);
										}
									}
								}
							});
						});
					} else {
						let pushProperty;
						if(webpackProp === 'noParse') {
							pushProperty = j.literal(webpackProperties.module[webpackProp]);
						} else {
							pushProperty = j.identifier(webpackProperties.module[webpackProp]);
						}
						// module.rules is an external object
						return prop.value.properties.push(
							transformUtils.createPropertyWithSuppliedProperty(j, webpackProp, pushProperty)
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
		.filter(p => isAssignment(p, createModuleProperties));
	}
};
