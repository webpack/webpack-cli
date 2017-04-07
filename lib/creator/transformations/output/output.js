const webpackOutputTypes = require('./output-types');
const utils = require('../../../transformations/utils');

module.exports = function(j, ast, webpackProperties) {
	if(!webpackProperties['output']) {
		return ast;
	} else if(webpackProperties['output'].length) {
		throw new Error('Supplying output with only no options is not supported.');
	}

	function createOutputProperties(p) {
		p.value.properties.push(utils.createProperty(j, 'output', 'null'));
		p.value.properties[1].value.type = 'ObjectExpression';
		p.value.properties[1].value.properties = [];
		Object.keys(webpackProperties.output).forEach( (prop) => {
			if(webpackOutputTypes.includes(prop)) {
				p.value.properties[1].value.properties.push(
					utils.createProperty(j, prop, webpackProperties.output[prop])
				);
			}
		});
	}
	return ast.find(j.ObjectExpression).filter(p => createOutputProperties(p));
};
