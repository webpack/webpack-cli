const isEmpty = require("lodash/isEmpty");
const findPluginsByName = require("../../utils/ast-utils").findPluginsByName;
const createOrUpdatePluginByName = require("../../utils/ast-utils")
	.createOrUpdatePluginByName;
const safeTraverse = require("../../utils/ast-utils").safeTraverse;

/**
 *
 * Transform which adds context information for old loaders by injecting a `LoaderOptionsPlugin`
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 *
 */

module.exports = function(j, ast) {
	const loaderOptions = {};

	// If there is debug: true, set debug: true in the plugin
	// TODO: remove global debug setting
	// TODO: I can't figure out how to find the topmost `debug: true`. help!
	if (ast.find(j.Identifier, { name: "debug" }).size()) {
		loaderOptions.debug = true;
	}

	// If there is UglifyJsPlugin, set minimize: true
	if (findPluginsByName(j, ast, ["webpack.optimize.UglifyJsPlugin"]).size()) {
		loaderOptions.minimize = true;
	}

	return ast
		.find(j.ArrayExpression)
		.filter(
			path =>
				safeTraverse(path, ["parent", "value", "key", "name"]) === "plugins"
		)
		.forEach(path => {
			!isEmpty(loaderOptions) &&
				createOrUpdatePluginByName(
					j,
					path,
					"webpack.LoaderOptionsPlugin",
					loaderOptions
				);
		});
};
