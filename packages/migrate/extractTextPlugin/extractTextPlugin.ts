import * as utils from "@webpack-cli/utils/ast-utils";

import { IJSCodeshift, INode } from "../types/NodePath";

/**
 *
 * Check whether `node` is the invocation of the plugin denoted by `pluginName`
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Path} node - ast node to check
 * @param {String} pluginName - name of the plugin
 * @returns {Boolean} isPluginInvocation - whether `node` is the invocation of the plugin denoted by `pluginName`
 */

function findInvocation(j: IJSCodeshift, path: INode, pluginName: string): boolean {
	let found: boolean = false;
	found =
		j(path)
			.find(j.MemberExpression)
			.filter((p: INode): boolean => p.get("object").value.name === pluginName)
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

export default function(j: IJSCodeshift, ast: INode): void | INode {
	const changeArguments = (path: INode): INode => {
		const args: INode[] = path.value.arguments;

		const literalArgs: INode[] = args.filter((p: INode): boolean => utils.isType(p, "Literal"));
		if (literalArgs && literalArgs.length > 1) {
			const newArgs: object = j.objectExpression(
				literalArgs.map((p: INode, index: number): INode =>
					utils.createProperty(j, index === 0 ? "fallback" : "use", p.value),
				),
			);
			path.value.arguments = [newArgs];
		}
		return path;
	};
	const name: string = utils.findVariableToPlugin(
		j,
		ast,
		"extract-text-webpack-plugin",
	);
	if (!name) { return ast; }

	return ast
		.find(j.CallExpression)
		.filter((p: INode): boolean => findInvocation(j, p, name))
		.forEach(changeArguments);
}
