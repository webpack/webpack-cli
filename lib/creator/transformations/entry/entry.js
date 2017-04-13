module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createEntryProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(j.property('init', j.identifier('entry'), j.literal('null')));
			p.value.properties.filter(node => node.key.name === 'entry').forEach( (prop) => {
				if((webpackProperties['entry'] && webpackProperties['entry'].length)) {
					prop.value.value = webpackProperties['entry'];
				}
				else {
					prop.value.type = 'ObjectExpression';
					prop.value.properties = [];
					Object.keys(webpackProperties.entry).forEach( (webpackProps) => {
						prop.value.properties.push(
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
	}
	if(webpackProperties['entry']) {
		return ast.find(j.ObjectExpression).filter(p => createEntryProperty(p));
	} else {
		return ast;
	}
};
