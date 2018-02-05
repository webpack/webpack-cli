const utils = require("../../utils/ast-utils");

/**
 *
 * Check whether `node` is the invocation of the plugin denoted by `pluginName`
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} node - ast node to check
 * @param {String} pluginName - name of the plugin
 * @returns {Boolean} isPluginInvocation - whether `node` is the invocation of the plugin denoted by `pluginName`
 */

function findInvocation(j, node, pluginName) {
	let found = false;
	found =
		j(node)
			.find(j.MemberExpression)
			.filter(p => p.get("object").value.name === pluginName)
			.size() > 0;
	return found;
}

/**
 *
 * Transform for ExtractTextPlugin arguments. Consolidates arguments into single options object.
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

module.exports = function(j, ast) {
	const changeArguments = function(p) {
		const args = p.value.arguments;

		const literalArgs = args.filter(p => utils.isType(p, "Literal"));
		if (literalArgs && literalArgs.length > 1) {
			const newArgs = j.objectExpression(
				literalArgs.map((p, index) =>
					utils.createProperty(j, index === 0 ? "fallback" : "use", p.value)
				)
			);
			p.value.arguments = [newArgs];
		}
		return p;
	};
	const name = utils.findVariableToPlugin(
		j,
		ast,
		"extract-text-webpack-plugin"
	);
	if (!name) return ast;

	return ast
		.find(j.CallExpression)
		.filter(p => findInvocation(j, p, name))
		.forEach(changeArguments);
};
