import chalk from "chalk";

import * as utils from "@webpack-cli/utils/ast-utils";

import { IJSCodeshift, INode } from "../types/NodePath";

/**
 *
 * Find deprecated plugins and remove them from the `plugins` array, if possible.
 * Otherwise, warn the user about removing deprecated plugins manually.
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

export default function(j: IJSCodeshift, ast: INode) {

	// List of deprecated plugins to remove
	// each item refers to webpack.optimize.[NAME] construct
	const deprecatedPlugingsList: string[] = [
		"webpack.optimize.OccurrenceOrderPlugin",
		"webpack.optimize.DedupePlugin",
	];

	return utils
		.findPluginsByName(j, ast, deprecatedPlugingsList)
		.forEach((path: INode): void => {
			// For now we only support the case where plugins are defined in an Array
			const arrayPath: INode = utils.safeTraverse(path, ["parent", "value"]);

			if (arrayPath && utils.isType(arrayPath, "ArrayExpression")) {
				// Check how many plugins are defined and
				// if there is only last plugin left remove `plugins: []` node
				const arrayElementsPath: INode[] = utils.safeTraverse(arrayPath, ["elements"]);
				if (arrayElementsPath && arrayElementsPath.length === 1) {
					j(path.parent.parent).remove();
				} else {
					j(path).remove();
				}
			} else {
				console.error(`
${chalk.red("Please remove deprecated plugins manually. ")}
See ${chalk.underline(
		"https://webpack.js.org/guides/migrating/",
	)} for more information.`);
			}
		});
}
