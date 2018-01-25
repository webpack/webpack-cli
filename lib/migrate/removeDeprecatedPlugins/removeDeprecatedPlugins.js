const chalk = require("chalk");
const utils = require("../../utils/ast-utils");

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
			// For now we only support the case there plugins are defined in an Array
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
