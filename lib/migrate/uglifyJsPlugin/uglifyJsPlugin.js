const findPluginsByName = require("../../utils/ast-utils").findPluginsByName;

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
