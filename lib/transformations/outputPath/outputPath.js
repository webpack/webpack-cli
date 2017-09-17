// @flow
// eslint-disable-next-line node/no-unsupported-features
import type {
	Ijscodeshit,
	ICallExpression,
	IPath
} from "../../types";

const utils = require("../utils");

module.exports = function(j: Ijscodeshit, ast: IPath<*>): IPath<*> {
	const literalOutputPath = ast
		.find(j.ObjectExpression)
		.filter((p: IPath<*>) => utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) === "output")
		.find(j.Property)
		.filter((p: IPath<*>) => utils.safeTraverse(p, ["value", "key", "name"]) === "path"
			&& utils.safeTraverse(p, ["value", "value", "type"]) === "Literal");

	if (literalOutputPath) {
		let pathVarName: ?string = "path";
		let isPathPresent: boolean = false;
		const pathDecalaration = ast
			.find(j.VariableDeclarator)
			.filter((p: IPath<*>) => utils.safeTraverse(p, ["value", "init", "callee", "name"]) === "require")
			.filter((p: IPath<*>) => utils.safeTraverse(p, ["value", "init", "arguments"])
					&& p.value.init.arguments.reduce((isPresent, a) => {
						return a.type === "Literal" && a.value === "path" || isPresent;
					}, false));

		if (pathDecalaration) {
			isPathPresent = true;
			pathDecalaration.forEach(p => {
				pathVarName = utils.safeTraverse(p, ["value", "id", "name"]);
			});
		}
		const finalPathName: string = (pathVarName: any);
		literalOutputPath
			.find(j.Literal)
			.replaceWith((p: IPath<*>) => replaceWithPath(j, p, finalPathName));

		if (!isPathPresent) {
			const pathRequire: string = (utils.getRequire(j, "path", "path"): any);
			return ast.find(j.Program)
				.replaceWith(p => j.program([].concat(pathRequire).concat(p.value.body)));
		}
	}
	return ast;
};

function replaceWithPath(j: Ijscodeshit, p: IPath<*>, pathVarName: string): IPath<ICallExpression> {
	const convertedPath = j.callExpression(
		j.memberExpression(
			j.identifier(pathVarName),
			j.identifier("join"),
			false),
		[j.identifier("__dirname"), p.value]);
	return convertedPath;
}
