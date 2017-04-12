module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.webpackOptions;
	function createBailProperty(p) {
		if(p.parent.value.type === 'AssignmentExpression') {
			let bailVal = (typeof webpackProperties['bail'] === 'boolean')
			? j.literal(webpackProperties['bail']) : j.identifier(webpackProperties['bail']);
			p.value.properties.push(j.property('init', j.identifier('bail'), bailVal));
		}
	}
	if(typeof(webpackProperties['bail']) === 'boolean') {
		return ast.find(j.ObjectExpression).filter(p => createBailProperty(p));
	} else {
		return ast;
	}
};
