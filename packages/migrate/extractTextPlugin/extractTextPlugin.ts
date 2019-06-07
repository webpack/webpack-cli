import * as utils from "@webpack-cli/utils/ast-utils";

import { JSCodeshift, Node } from "../types/NodePath";

/**
 *
 * Check whether `node` is the invocation of the plugin denoted by `pluginName`
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Path} node - ast node to check
 * @param {String} pluginName - name of the plugin
 * @returns {Boolean} isPluginInvocation - whether `node` is the invocation of the plugin denoted by `pluginName`
 */

function findInvocation(j: JSCodeshift, path: Node, pluginName: string): boolean {
	let found = false;
	found =
		j(path)
			.find(j.MemberExpression)
			.filter((p: Node): boolean => (p.get("object").value as Node).name === pluginName)
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

export default function(j: JSCodeshift, ast: Node): void | Node {
	const changeArguments = (path: Node): Node => {
		const args: Node[] = (path.value as Node).arguments;

		const literalArgs: Node[] = args.filter((p: Node): boolean => utils.isType(p, "Literal"));
		if (literalArgs && literalArgs.length > 1) {
			const newArgs: object = j.objectExpression(
				literalArgs.map(
					(p: Node, index: number): Node =>
						utils.createProperty(j, index === 0 ? "fallback" : "use", p.value as Node)
				)
			);
			(path.value as Node).arguments = [newArgs];
		}
		return path;
	};
	const name: string = utils.findVariableToPlugin(j, ast, "extract-text-webpack-plugin");
	if (!name) {
		return ast;
	}

	return ast
		.find(j.CallExpression)
		.filter((p: Node): boolean => findInvocation(j, p, name))
		.forEach(changeArguments);
}
