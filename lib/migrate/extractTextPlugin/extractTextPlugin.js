const utils = require("../../utils/ast-utils");

/**
 *
 * Check whether `node` is the invocation of the plugin denoted by `pluginName`
 *
 * @param {object} j — jscodeshift top-level import
 * @param {Node} node — ast node to check
 * @returns {boolean}
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
 * @param {object} j — jscodeshift top-level import
 * @param {Collection} ast — jscodeshift Collection to transform
 * @returns {Collection} ast — jscodeshift Collection
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
