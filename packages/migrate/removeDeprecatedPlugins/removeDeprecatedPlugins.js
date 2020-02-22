"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const utils = require("@webpack-cli/utils/ast-utils");
/**
 *
 * Find deprecated plugins and remove them from the `plugins` array, if possible.
 * Otherwise, warn the user about removing deprecated plugins manually.
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
function default_1(j, ast) {
    // List of deprecated plugins to remove
    // each item refers to webpack.optimize.[NAME] construct
    const deprecatedPlugingsList = [
        "webpack.optimize.OccurrenceOrderPlugin",
        "webpack.optimize.DedupePlugin"
    ];
    return utils.findPluginsByName(j, ast, deprecatedPlugingsList).forEach((path) => {
        // For now we only support the case where plugins are defined in an Array
        const arrayPath = utils.safeTraverse(path, ["parent", "value"]);
        if (arrayPath && utils.isType(arrayPath, "ArrayExpression")) {
            // Check how many plugins are defined and
            // if there is only last plugin left remove `plugins: []` node
            //
            const arrayElementsPath = utils.safeTraverse(arrayPath, ["elements"]);
            if (arrayElementsPath && arrayElementsPath.length === 1) {
                j(path.parent.parent).remove();
            }
            else {
                j(path).remove();
            }
        }
        else {
            process.stderr.write(`
${chalk_1.default.red("Please remove deprecated plugins manually. ")}
See ${chalk_1.default.underline("https://webpack.js.org/guides/migrating/")} for more information.`);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=removeDeprecatedPlugins.js.map