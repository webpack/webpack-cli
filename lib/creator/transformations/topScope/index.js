module.exports = function(j, ast, webpackProperties) {
	function createTopScopeProperty(p) {
		webpackProperties.forEach( (n) => {
			if(n.__paths) {
				const topScopeVar = n.__paths[0].value.program.body[0];
				p.value.body.splice(-1, 0, topScopeVar);
			}
		});
	}
	return ast.find(j.Program).filter(p => createTopScopeProperty(p));
};
