const utils = require('../../../transformations/utils');
const jscodeshift = require('jscodeshift');
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
	function createEntryProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(utils.createProperty(j, 'entry', 'null'));
			p.value.properties.filter(node => node.key.value === 'entry').forEach( (prop) => {
				if((webpackProperties['entry'] && webpackProperties['entry'].length) && !webpackProperties['entry'].__paths) {
					prop.value.value = webpackProperties['entry'];
				}
				else if(webpackProperties['entry'].__paths) {
					let funcDec = webpackProperties.entry.__paths[0].value.program.body[0];
					prop.value = funcDec;
				} else {
					prop.value.type = 'ObjectExpression';
					prop.value.properties = [];
					Object.keys(webpackProperties.entry).forEach( (webpackProps) => {
						if(webpackProperties.entry[webpackProps].__paths) {
							let funcDec = webpackProperties.entry[webpackProps].__paths[0].value.program.body[0];
							prop.value.properties.push(
								utils.createProperty(j, webpackProps, 'null')
							);
							prop.value.properties.filter(node => node.key.value === webpackProps).forEach( (funcProp) => {
								funcProp.value = funcDec;
							});
						} else {
							prop.value.properties.push(
								utils.createProperty(j, webpackProps, webpackProperties.entry[webpackProps])
							);
						}
					});
				}
			});
		}
	}
	if(webpackProperties['entry']) {
		return ast.find(j.ObjectExpression).filter(p => createEntryProperty(p));
	} else {
		return ast;
	}
};
