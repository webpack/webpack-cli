/**
 *
 * Get an property named topScope from yeoman and inject it to the top scope of
 * the config, outside module.exports
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function(j, ast, webpackProperties, action) {
	function createTopScopeProperty(p) {
		webpackProperties.forEach(n => {
			if (
				!p.value.body[0].declarations ||
				n.indexOf(p.value.body[0].declarations[0].id.name) <= 0
			) {
				p.value.body.splice(-1, 0, n);
			}
		});
	}
	if (webpackProperties) {
		return ast.find(j.Program).filter(p => createTopScopeProperty(p));
	} else {
		return ast;
	}
};
