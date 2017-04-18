const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createWatchProperty(p) {
		const propValue = transformUtils.createIdentifierOrLiteral(j, webpackProperties['watch']);
		checkIfExistsAndAddValue(j, p, 'watch', propValue);
	}
	if(typeof(webpackProperties['watch']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => isAssignment(p, createWatchProperty));
	} else {
		return ast;
	}
};

function checkIfExistsAndAddValue(j, p, key, value) {
	const existingProp = p.value.properties.filter(prop => prop.key.name === key);
	let prop;
	if (existingProp.length > 0){
		prop = existingProp[0];
		prop.value = value;
	} else {
		prop = j.property('init', j.identifier('watch'), value);
		p.value.properties.push(prop);
	}
}
