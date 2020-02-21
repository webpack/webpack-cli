import * as utils from "@webpack-cli/utils/ast-utils";

import { JSCodeshift, Node } from "../types/NodePath";

/**
 *
 * Transform for BannerPlugin arguments. Consolidates first and second argument (if
 * both are present) into single options object.
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

export default function(j: JSCodeshift, ast: Node): Node {
	return utils.findPluginsByName(j, ast, ["webpack.BannerPlugin"]).forEach((path: Node): void => {
		const args: Node[] = (path.value as Node).arguments; // any node
		// If the first argument is a literal replace it with object notation
		// See https://webpack.js.org/guides/migrating/#bannerplugin-breaking-change
		if (args && args.length > 1 && args[0].type === j.Literal.name) {
			// and remove the first argument
			(path.value as Node).arguments = [(path.value as Node).arguments[1]];
			utils.createOrUpdatePluginByName(j, path.parent, "webpack.BannerPlugin", {
				banner: args[0].value
			});
		}
	});
}
