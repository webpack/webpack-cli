import isEmpty = require("lodash/isEmpty");

import { createOrUpdatePluginByName, findPluginsByName, safeTraverse } from "@webpack-cli/utils/ast-utils";

import { JSCodeshift, Node } from "../types/NodePath";

interface LoaderOptions {
	debug?: boolean;
	minimize?: boolean;
}

/**
 *
 * Transform which adds context information for old loaders by injecting a `LoaderOptionsPlugin`
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 *
 */

export default function(j: JSCodeshift, ast: Node): Node {
	const loaderOptions: LoaderOptions = {};

	// If there is debug: true, set debug: true in the plugin
	if (ast.find(j.Identifier, { name: "debug" }).size()) {
		loaderOptions.debug = true;

		ast.find(j.Identifier, { name: "debug" }).forEach((p: Node): void => {
			p.parent.prune();
		});
	}

	// If there is UglifyJsPlugin, set minimize: true
	if (findPluginsByName(j, ast, ["webpack.optimize.UglifyJsPlugin"]).size()) {
		loaderOptions.minimize = true;
	}

	return ast
		.find(j.ArrayExpression)
		.filter((path: Node): boolean => safeTraverse(path, ["parent", "value", "key", "name"]) === "plugins")
		.forEach((path: Node): void => {
			if (!isEmpty(loaderOptions)) {
				createOrUpdatePluginByName(j, path, "webpack.LoaderOptionsPlugin", loaderOptions);
			}
		});
}
