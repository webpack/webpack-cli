const utils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function addEntryPoints(entries) {
		if(entries.length) return entries;
		const entryKeys = Object.keys(entries);
		if (entryKeys && entryKeys.length) {
			return j.objectExpression(
				entryKeys.map(entryKey =>
				utils.createProperty(entryKey, entries[entryKey]))
			);
		}

	}
	function createEntryProperty(p) {
		let entryNode = p.value.properties;
		entryNode.push(utils.createProperty('entry',
		addEntryPoints(webpackProperties['entry'])));
	}
	if(webpackProperties['entry']) {
		return ast.find(j.ObjectExpression)
		.filter(utils.findWebpackRoot)
		.filter(p => createEntryProperty(p));
	} else {
		return ast;
	}
};
