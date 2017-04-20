module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.topScope;
	function createTopScopeProperty(p) {
		webpackProperties.forEach( (n) => {
			p.value.body.splice(-1, 0, n);
		});
	}
	return ast.find(j.Program).filter(p => createTopScopeProperty(p));
};
