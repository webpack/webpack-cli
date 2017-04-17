const isAssignment = require('../../utils/is-assignment');
const transformUtils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function addEntryPoints(entries) {

		if(Array.isArray(entries)) {
			return j.arrayExpression(entries.map(entry => transformUtils.createLiteral(j, entry)));
		} else if (typeof entries === 'string') {
			return transformUtils.createLiteral(j, entries);
		}
		const entryKeys = Object.keys(entries);
		if (entryKeys && entryKeys.length) {
			return j.objectExpression(
				entryKeys.map(entryKey => {
					return j.property( 'init',
						transformUtils.createLiteral(j, entryKey),
						transformUtils.createLiteral(j, entries[entryKey])
					);
				})
			);
		}

	}
	function createEntryProperty(p) {
		let entryNode = p.value.properties;
		entryNode.push(
			j.property( 'init',
				transformUtils.createLiteral(j, 'entry'),
				addEntryPoints(webpackProperties['entry'])));
	}
	if(webpackProperties['entry']) {
		return ast.find(j.ObjectExpression)
		.filter(p => isAssignment(p, createEntryProperty));
	} else {
		return ast;
	}
};
