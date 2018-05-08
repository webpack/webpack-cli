const utils = require("../../utils/ast-utils");

/**
 *
 * Transform which adds `path.join` call to `output.path` literals
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

module.exports = function(j, ast) {
	const literalOutputPath = ast
		.find(j.ObjectExpression)
		.filter(
			p =>
				utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
				"output"
		)
		.find(j.Property)
		.filter(
			p =>
				utils.safeTraverse(p, ["value", "key", "name"]) === "path" &&
				utils.safeTraverse(p, ["value", "value", "type"]) === "Literal"
		);

	if (literalOutputPath) {
		let pathVarName = "path";
		let isPathPresent = false;
		const pathDeclaration = ast
			.find(j.VariableDeclarator)
			.filter(
				p =>
					utils.safeTraverse(p, ["value", "init", "callee", "name"]) ===
					"require"
			)
			.filter(
				p =>
					utils.safeTraverse(p, ["value", "init", "arguments"]) &&
					p.value.init.arguments.reduce((isPresent, a) => {
						return (a.type === "Literal" && a.value === "path") || isPresent;
					}, false)
			);

		if (pathDeclaration) {
			isPathPresent = true;
			pathDeclaration.forEach(p => {
				pathVarName = utils.safeTraverse(p, ["value", "id", "name"]);
			});
		}
		const finalPathName = pathVarName;
		literalOutputPath
			.find(j.Literal)
			.replaceWith(p => replaceWithPath(j, p, finalPathName));

		if (!isPathPresent) {
			const pathRequire = utils.getRequire(j, "path", "path");
			return ast
				.find(j.Program)
				.replaceWith(p =>
					j.program([].concat(pathRequire).concat(p.value.body))
				);
		}
	}
	return ast;
};

function replaceWithPath(j, p, pathVarName) {
	const convertedPath = j.callExpression(
		j.memberExpression(j.identifier(pathVarName), j.identifier("join"), false),
		[j.identifier("__dirname"), p.value]
	);
	return convertedPath;
}
