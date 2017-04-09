const utils = require('../../../transformations/utils');
const watchOptionTypes = require('./watchOptions-types');

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
	function createWatchOptionsProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(utils.createProperty(j, 'watchOptions', null));
			p.value.properties.filter(node => node.key.value === 'watchOptions').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties['watchOptions']).filter( (watchOption) => {
					if(watchOptionTypes.includes(watchOption)) {
						prop.value.properties.push(
							utils.createProperty(j, watchOption, webpackProperties['watchOptions'][watchOption])
						);
					} else {
						throw new Error('Unknown Property', watchOption);
					}
				});
			});
		}
	}
	if(webpackProperties['watchOptions'] && webpackProperties['watchOptions']) {
		return ast.find(j.ObjectExpression).filter(p => createWatchOptionsProperty(p));
	} else {
		return ast;
	}
};
