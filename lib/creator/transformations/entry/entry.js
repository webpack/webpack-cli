module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createEntryProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			p.value.properties.push(j.property('init', j.identifier('entry'), j.literal('null')));
			p.value.properties.filter(node => node.key.name === 'entry').forEach( (prop) => {
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
								j.property('init', j.identifier(webpackProps), j.literal('null'))
							);
							prop.value.properties.filter(node => node.key.name === webpackProps).forEach( (funcProp) => {
								funcProp.value = funcDec;
							});
						} else {
							prop.value.properties.push(
								j.property('init', j.identifier(webpackProps), j.literal(webpackProperties.entry[webpackProps]))
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
