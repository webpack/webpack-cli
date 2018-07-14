import * as utils from "@webpack-cli/utils/ast-utils";

import { IJSCodeshift, INode } from "../types/NodePath";

/**
 *
 * Transform which adds `path.join` call to `output.path` literals
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

export default function(j: IJSCodeshift, ast: INode): INode | void {

	const literalOutputPath: INode = ast
		.find(j.ObjectExpression)
		.filter(
			(p: INode): boolean =>
				utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
				"output",
		)
		.find(j.Property)
		.filter(
			(p: INode): boolean =>
				utils.safeTraverse(p, ["value", "key", "name"]) === "path" &&
				utils.safeTraverse(p, ["value", "value", "type"]) === "Literal",
		);

	if (literalOutputPath) {
		let pathVarName = "path";
		let isPathPresent = false;
		const pathDeclaration: INode = ast
			.find(j.VariableDeclarator)
			.filter(
				(p: INode): boolean =>
					utils.safeTraverse(p, ["value", "init", "callee", "name"]) ===
					"require",
			)
			.filter(
				(p: INode): boolean =>
					utils.safeTraverse(p, ["value", "init", "arguments"]) &&
					p.value.init.arguments.reduce((isPresent: boolean, a: INode): boolean => {
						return (a.type === "Literal" && a.value === "path") || isPresent;
					}, false),
			);

		if (pathDeclaration) {
			isPathPresent = true;
			pathDeclaration.forEach((p: INode): void => {
				pathVarName = utils.safeTraverse(p, ["value", "id", "name"]);
			});
		}
		const finalPathName = pathVarName;
		literalOutputPath
			.find(j.Literal)
			.replaceWith((p: INode): INode => replaceWithPath(j, p, finalPathName));

		if (!isPathPresent) {
			const pathRequire: INode[] = utils.getRequire(j, "path", "path");
			return ast
				.find(j.Program)
				.replaceWith((p: INode): INode =>
					j.program([].concat(pathRequire).concat(p.value.body)),
				);
		}
	}

	return ast;
}

function replaceWithPath(j: IJSCodeshift, p: INode, pathVarName: string): INode {
	const convertedPath: INode = j.callExpression(
		j.memberExpression(j.identifier(pathVarName), j.identifier("join"), false),
		[j.identifier("__dirname"), p.value],
	);

	return convertedPath;
}
