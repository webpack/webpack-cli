const {
	addOrUpdateConfigObject,
	findAndRemovePluginByName
} = require("../../utils/ast-utils");

/**
 *
 * Transform for NamedModulesPlugin. If found, removes the
 * plugin and sets optimizations.namedModules to true
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
module.exports = function(j, ast) {
	// Remove old plugin
	const root = findAndRemovePluginByName(
		j,
		ast,
		"webpack.optimize.ModuleConcatenationPlugin"
	);

	// Add new optimizations option
	root &&
		addOrUpdateConfigObject(
			j,
			root,
			"optimizations",
			"concatenateModules",
			j.booleanLiteral(true)
		);

	return ast;
};
