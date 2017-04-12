const webpackOutputTypes = require('./output-types');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createOutputProperties(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(j.property('init', j.identifier('output'), j.objectExpression([])));
			p.value.properties.filter( node => node.key.name === 'output').forEach( (prop) => {
				Object.keys(webpackProperties.output).forEach( (webpackProp) => {
					if(webpackOutputTypes.includes(webpackProp)) {
						if(typeof webpackProperties.output[webpackProp] === 'boolean') {
							prop.value.properties.push(
								j.property('init', j.identifier(webpackProp), j.literal(webpackProperties.output[webpackProp]))
							);
						}
						else if(webpackProperties.output[webpackProp].__paths) {
							let regExpProp = webpackProperties.output[webpackProp].__paths[0].value.program.body[0].expression;
							prop.value.properties.push(
								j.property('init', j.identifier(webpackProp), j.literal(regExpProp.value))
							);
						}
						else {
							prop.value.properties.push(
								j.property('init', j.identifier(webpackProp), j.identifier(webpackProperties.output[webpackProp]))
							);
						}
					} else {
						return ast;
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
