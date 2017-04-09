const utils = require('../../../transformations/utils');
/*
safeTraverse,
createProperty,
findPluginsByName,
findPluginsRootNodes,
createOrUpdatePluginByName,
findVariableToPlugin,
isType,
createLiteral,
findObjWithOneOfKeys,
getRequire
*/

module.exports = function(j, ast, webpackProperties) {
	function createExternalProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(utils.createProperty(j, 'externals', null));
			p.value.properties.filter(node => node.key.value === 'externals').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.externals).forEach( (webpackProp) => {
					if(Array.isArray(webpackProperties.externals[webpackProp])) {
						// if we got a type, we make it an array
						const externalArray = j.property('init', j.identifier(webpackProp), j.arrayExpression([]));
						webpackProperties.externals[webpackProp].forEach( (n) => {
							return externalArray.value.elements.push(j.literal(n));
						});
						prop.value.properties.push(externalArray);
					}
					else if(typeof(webpackProperties.externals[webpackProp]) === 'function') {
						// function declr.
					}
					else if(typeof(webpackProperties.externals[webpackProp]) === 'string') {
						prop.value.properties.push(utils.createProperty(j, webpackProp, webpackProperties.externals[webpackProp]));
					}
					else {
						prop.value.properties.push(utils.createProperty(j, webpackProp, null));
						prop.value.properties.forEach( (externalProp) => {
							if(externalProp.key.value === webpackProp) {
								externalProp.value.type = 'ObjectExpression';
								externalProp.value.properties = [];
								Object.keys(webpackProperties.externals[webpackProp]).forEach( (subProps) => {
									if(Array.isArray(webpackProperties.externals[webpackProp][subProps])) {
										const subExternalArray = j.property('init', j.identifier(subProps), j.arrayExpression([]));
										webpackProperties.externals[webpackProp][subProps].forEach( (n) => {
											return subExternalArray.value.elements.push(j.literal(n));
										});
										externalProp.value.properties.push(subExternalArray);
									} else {
										externalProp.value.properties.push(
											utils.createProperty(j, subProps, webpackProperties.externals[webpackProp][subProps])
										);
									}
								});
							}
						});
					}
				});
			});
		}
	}
	if(webpackProperties['externals'] && typeof webpackProperties['externals'] === 'object') {
		return ast.find(j.ObjectExpression).filter(p => createExternalProperty(p));
	} else {
		return ast;
	}
};
