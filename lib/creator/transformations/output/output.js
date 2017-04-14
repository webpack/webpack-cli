const webpackOutputTypes = require('./output-types');
const isAssignment = require('../../utils/is-assignment');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createOutputProperties(p) {
		let outputNode = p.value.properties;
		outputNode.push(j.property('init', j.identifier('output'), j.objectExpression([])));

		outputNode.filter( n => n.key.name === 'output').forEach( (prop) => {
			Object.keys(webpackProperties.output).forEach( (webpackProp) => {
				if(webpackOutputTypes.includes(webpackProp)) {
					if(typeof webpackProperties.output[webpackProp] === 'boolean') {
						prop.value.properties.push(
							j.property(
								'init',
								j.identifier(webpackProp),
								j.literal(webpackProperties.output[webpackProp])
							)
						);
					}
					else if(webpackProperties.output[webpackProp].__paths) {
						let regExpProp =
						webpackProperties.output[webpackProp].__paths[0].value.program.body[0].expression;

						prop.value.properties.push(
							j.property('init', j.identifier(webpackProp), j.literal(regExpProp.value))
						);
					}
					else {
						prop.value.properties.push(
							j.property(
								'init',
								j.identifier(webpackProp),
								j.identifier(webpackProperties.output[webpackProp])
							)
						);
					}
				}
			});
		});
	}
	if(webpackProperties['output']) {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createOutputProperties));
	} else {
		return ast;
	}
};
