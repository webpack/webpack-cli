const chalk = require("chalk");
const utils = require("../../utils/ast-utils");

/**
 *
 * Find deprecated plugins and remove them from the `plugins` array, if possible.
 * Otherwise, warn the user about removing deprecated plugins manually.
 *
 * @param {object} j — jscodeshift top-level import
 * @param {Collection} ast — jscodeshift Collection to transform
 * @returns {Collection} ast — jscodeshift Collection
 */

module.exports = function(j, ast, source) {
	// List of deprecated plugins to remove
	// each item refers to webpack.optimize.[NAME] construct
	const deprecatedPlugingsList = [
		"webpack.optimize.OccurrenceOrderPlugin",
		"webpack.optimize.DedupePlugin"
	];

	return utils
		.findPluginsByName(j, ast, deprecatedPlugingsList)
		.forEach(path => {
			// For now we only support the case where plugins are defined in an Array
			const arrayPath = utils.safeTraverse(path, ["parent", "value"]);
			if (arrayPath && utils.isType(arrayPath, "ArrayExpression")) {
				// Check how many plugins are defined and
				// if there is only last plugin left remove `plugins: []` node
				const arrayElementsPath = utils.safeTraverse(arrayPath, ["elements"]);
				if (arrayElementsPath && arrayElementsPath.length === 1) {
					j(path.parent.parent).remove();
				} else {
					j(path).remove();
				}
			} else {
				console.log(`
${chalk.red("Please remove deprecated plugins manually. ")}
See ${chalk.underline(
		"https://webpack.js.org/guides/migrating/"
	)} for more information.`);
			}
		});
};
