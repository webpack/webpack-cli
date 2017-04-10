const webpackOutputTypes = require('./output-types');
const utils = require('../../../transformations/utils');

module.exports = function(j, ast, webpackProperties) {
	function createOutputProperties(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(utils.createProperty(j, 'output', 'null'));
			p.value.properties.filter( node => node.key.value === 'output').forEach( (prop) => {
				prop.value.type = 'ObjectExpression';
				prop.value.properties = [];
				Object.keys(webpackProperties.output).forEach( (webpackProp) => {
					if(webpackOutputTypes.includes(webpackProp)) {
						prop.value.properties.push(
							utils.createProperty(j, webpackProp, webpackProperties.output[webpackProp])
						);
					}
				});
			});
		}
	}
	if(!webpackProperties['output']) {
		return ast;
	} else if(webpackProperties['output'].length) {
		throw new Error('Supplying output with only no options is not supported.');
	} else {
		return ast.find(j.ObjectExpression).filter(p => createOutputProperties(p));
	}
};
