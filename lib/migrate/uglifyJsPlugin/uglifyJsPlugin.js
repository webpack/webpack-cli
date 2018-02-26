const findPluginsByName = require("../../utils/ast-utils").findPluginsByName;

/**
 *
 * Transform which adds a `sourceMap: true` option to instantiations of the UglifyJsPlugin
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

module.exports = function(j, ast) {
	function createSourceMapsProperty() {
		return j.property("init", j.identifier("sourceMap"), j.identifier("true"));
	}

	return findPluginsByName(j, ast, ["webpack.optimize.UglifyJsPlugin"]).forEach(
		path => {
			const args = path.value.arguments;

			if (args.length) {
				// Plugin is called with object as arguments
				j(path)
					.find(j.ObjectExpression)
					.get("properties")
					.value.push(createSourceMapsProperty());
			} else {
				// Plugin is called without arguments
				args.push(j.objectExpression([createSourceMapsProperty()]));
			}
		}
	);
};
