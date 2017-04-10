const utils = require('../../../transformations/utils');
const performanceTypes = require('./performance-types');

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
	function createPerformanceProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(utils.createProperty(j, 'performance', null));
			p.value.properties.filter(node => node.key.value === 'performance').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.performance).forEach( (webpackProp) => {
					if(performanceTypes.includes(webpackProp)) {
						if(Array.isArray(webpackProperties.performance[webpackProp])) {
							throw new Error('Unknown Property', webpackProp);
						}
						else if(webpackProperties.performance[webpackProp].__paths) {
							let funcDec = webpackProperties.performance[webpackProp].__paths[0].value.program.body[0];
							prop.value.properties.push(utils.createProperty(j, webpackProp, 'null'));
							prop.value.properties.filter(node => node.key.value === webpackProp).forEach( (funcProp) => {
								funcProp.value = funcDec;
							});
						} else {
							prop.value.properties.push(utils.createProperty(j, webpackProp, webpackProperties.performance[webpackProp]));
						}
					} else {
						throw new Error('Unknown Property', webpackProp);
					}
				});
			});
		}
	}
	if(webpackProperties['performance'] && typeof(webpackProperties['performance']) === 'object') {
		return ast.find(j.ObjectExpression).filter(p => createPerformanceProperty(p));
	} else {
		return ast;
	}
};
