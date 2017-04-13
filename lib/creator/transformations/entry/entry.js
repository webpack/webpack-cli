module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createEntryProperty(p) {
		let entryNode = p.value.properties;
		entryNode.push(j.property('init', j.identifier('entry'), j.literal('null')));
		entryNode.filter(n => n.key.name === 'entry');
		entryNode.forEach( (entryProp) => {
			if(webpackProperties['entry'].length) {
				entryProp.value.value = webpackProperties['entry'];
			}
			else {
				entryProp.value.type = 'ObjectExpression';
				entryProp.value.properties = [];
				Object.keys(webpackProperties['entry']).forEach( (webpackProps) => {
					entryProp.value.properties.push(
						j.property(
							'init',
							j.identifier(webpackProps),
							j.identifier(webpackProperties.entry[webpackProps])
						)
					);
				});
			}
		});
	}
	if(webpackProperties['entry']) {
		return ast.find(j.ObjectExpression)
		.filter(p => createEntryProperty(p));
	} else {
		return ast;
	}
};
