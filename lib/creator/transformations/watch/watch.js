const isAssignment = require('../../utils/is-assignment');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createWatchProperty(p) {
		const existingProp = p.value.properties.filter(prop => prop.key.name === 'watch');
		let prop;
		if (existingProp.length > 0){
			prop = existingProp[0];
			prop.value = j.literal(webpackProperties['watch']);
		} else {
			prop = j.property('init', j.identifier('watch'), j.literal(webpackProperties['watch']));
			p.value.properties.push(prop);
		}
	}
	if(typeof(webpackProperties['watch']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createWatchProperty));
	} else {
		return ast;
	}
};
