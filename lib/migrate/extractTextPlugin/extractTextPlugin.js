const utils = require("../../utils/ast-utils");

function findInvocation(j, node, pluginName) {
	let found = false;
	found =
		j(node)
			.find(j.MemberExpression)
			.filter(p => p.get("object").value.name === pluginName)
			.size() > 0;
	return found;
}

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
