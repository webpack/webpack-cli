"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_utils_1 = require("@webpack-cli/utils/ast-utils");
/**
 *
 * Transform for NamedModulesPlugin. If found, removes the
 * plugin and sets optimizations.namedModules to true
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
function default_1(j, ast) {
    // Remove old plugin
    const root = ast_utils_1.findAndRemovePluginByName(j, ast, "webpack.NamedModulesPlugin");
    // Add new optimizations option
    if (root) {
        ast_utils_1.addOrUpdateConfigObject(j, root, "optimizations", "namedModules", j.booleanLiteral(true));
    }
    return ast;
}
exports.default = default_1;
//# sourceMappingURL=namedModulesPlugin.js.map