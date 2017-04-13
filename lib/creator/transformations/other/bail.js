module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;

	function createBailProperty(p) {
		let bailVal = (typeof webpackProperties['bail'] === 'boolean') ?
		j.literal(webpackProperties['bail']) : j.identifier(webpackProperties['bail']);
		p.value.properties.push(j.property('init', j.identifier('bail'), bailVal));
	}

	if(webpackProperties['bail']) {
		return ast.find(j.ObjectExpression)
		.filter(p => createBailProperty(p));
	} else {
		return ast;
	}
};
