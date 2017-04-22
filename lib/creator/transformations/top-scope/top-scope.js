
/*
*
* Get an property named topScope from yeoman and inject it to the top scope of
* the config, outside module.exports
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } yeomanConfig - Object containing topscope properties
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, yeomanConfig) {
	const webpackProperties = yeomanConfig.topScope;
	function createTopScopeProperty(p) {
		webpackProperties.forEach( (n) => {
			p.value.body.splice(-1, 0, n);
		});
	}
	return ast.find(j.Program).filter(p => createTopScopeProperty(p));
};
