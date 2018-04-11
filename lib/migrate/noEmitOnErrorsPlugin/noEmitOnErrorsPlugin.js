const {
	findPluginsByName,
	safeTraverse
} = require("../../utils/ast-utils");

/**
 *
 * Transform for NoEmitOnErrorsPlugin. If found, removes the
 * plugin and sets optimizations.noEmitOnErrors to true
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
module.exports = function(j, ast) {
	let rootPath;

	// Remove old plugin
	findPluginsByName(j, ast, ["webpack.NoEmitOnErrorsPlugin"])
		.filter(path => safeTraverse(path, ["parent", "value"]))
		.forEach(path => {
			rootPath = safeTraverse(path, ["parent", "parent", "parent", "value"]);
			const arrayPath = path.parent.value;
			if (arrayPath.elements && arrayPath.elements.length === 1) {
				j(path.parent.parent).remove();
			} else {
				j(path).remove();
			}
		});

	// Set new optimizations option
	if (rootPath) {
		const optimizationsExist = ast.find(j.Property).filter(path => path.node.key.name === "optimizations").size() > 0;

		if (optimizationsExist) {
			rootPath.properties.filter(path => path.key.name === "optimizations")
				.forEach(path => {
					const newProperties = path.value.properties.filter(path => path.key.name !== "noEmitOnErrors");
					newProperties.push(j.objectProperty(j.identifier("noEmitOnErrors"), j.booleanLiteral(true)));
					path.value.properties = newProperties;
				});
		} else {
			rootPath.properties.push(
				j.objectProperty(
					j.identifier("optimizations"),
					j.objectExpression([
						j.objectProperty(j.identifier("noEmitOnErrors"), j.booleanLiteral(true))
					])
				)
			);
		}
	}

	return ast;
};
