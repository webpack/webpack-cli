const findPluginsByName = require("../../utils/ast-utils").findPluginsByName;

/**
 *
 * Transform which adds a `sourceMap: true` option to instantiations of the UglifyJsPlugin
 *
 * @param {object} j — jscodeshift top-level import
 * @param {Collection} ast — jscodeshift Collection to transform
 * @returns {Collection} ast — jscodeshift Collection
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
