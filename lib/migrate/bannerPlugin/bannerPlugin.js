const utils = require("../../utils/ast-utils");

/**
 *
 * Transform for BannerPlugin arguments. Consolidates first and second argument (if
 * both are present) into single options object.
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

module.exports = function(j, ast) {
	return utils
		.findPluginsByName(j, ast, ["webpack.BannerPlugin"])
		.forEach(path => {
			const args = path.value.arguments; // any node
			// If the first argument is a literal replace it with object notation
			// See https://webpack.js.org/guides/migrating/#bannerplugin-breaking-change
			if (args && args.length > 1 && args[0].type === j.Literal.name) {
				// and remove the first argument
				path.value.arguments = [path.value.arguments[1]];
				utils.createOrUpdatePluginByName(
					j,
					path.parent,
					"webpack.BannerPlugin",
					{
						banner: args[0].value
					}
				);
			}
		});
};
