import { addOrUpdateConfigObject, findAndRemovePluginByName } from "@webpack-cli/utils/ast-utils";

import { JSCodeshift, Node } from "../types/NodePath";

/**
 *
 * Transform for NamedModulesPlugin. If found, removes the
 * plugin and sets optimizations.namedModules to true
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
export default function(j: JSCodeshift, ast: Node): Node {
	// Remove old plugin
	const root: Node = findAndRemovePluginByName(j, ast, "webpack.NamedModulesPlugin");

	// Add new optimizations option
	if (root) {
		addOrUpdateConfigObject(j, root, "optimizations", "namedModules", j.booleanLiteral(true));
	}

	return ast;
}
