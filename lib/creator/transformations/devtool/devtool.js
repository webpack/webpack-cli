const utils = require('../../../transformations/utils');

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createDevToolProperty(p) {
		return p.value.properties.push(
			utils.createProperty(j, 'devtool', webpackProperties['devtool']));
	}

	if(webpackProperties['devtool']) {
		return ast.find(j.ObjectExpression)
		.filter(utils.findWebpackRoot)
		.forEach(p => createDevToolProperty(p));
	} else {
		return ast;
	}
};
