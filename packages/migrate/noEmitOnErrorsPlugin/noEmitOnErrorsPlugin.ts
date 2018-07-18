import {
	addOrUpdateConfigObject,
	findAndRemovePluginByName,
} from "@webpack-cli/utils/ast-utils";
import { IJSCodeshift, INode } from "../types/NodePath";

/**
 *
 * Transform for NoEmitOnErrorsPlugin. If found, removes the
 * plugin and sets optimizations.noEmitOnErrors to true
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
export default function(j: IJSCodeshift, ast: INode): INode {
	// Remove old plugin
	const root: INode = findAndRemovePluginByName(
		j,
		ast,
		"webpack.NoEmitOnErrorsPlugin",
	);

	// Add new optimizations option
	if (root) {
		addOrUpdateConfigObject(
			j,
			root,
			"optimizations",
			"noEmitOnErrors",
			j.booleanLiteral(true),
		);
	}

	return ast;
}
