"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty = require("lodash/isEmpty");
const ast_utils_1 = require("@webpack-cli/utils/ast-utils");
/**
 *
 * Transform which adds context information for old loaders by injecting a `LoaderOptionsPlugin`
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 *
 */
function default_1(j, ast) {
    const loaderOptions = {};
    // If there is debug: true, set debug: true in the plugin
    if (ast.find(j.Identifier, { name: "debug" }).size()) {
        loaderOptions.debug = true;
        ast.find(j.Identifier, { name: "debug" }).forEach((p) => {
            p.parent.prune();
        });
    }
    // If there is UglifyJsPlugin, set minimize: true
    if (ast_utils_1.findPluginsByName(j, ast, ["webpack.optimize.UglifyJsPlugin"]).size()) {
        loaderOptions.minimize = true;
    }
    return ast
        .find(j.ArrayExpression)
        .filter((path) => ast_utils_1.safeTraverse(path, ["parent", "value", "key", "name"]) === "plugins")
        .forEach((path) => {
        if (!isEmpty(loaderOptions)) {
            ast_utils_1.createOrUpdatePluginByName(j, path, "webpack.LoaderOptionsPlugin", loaderOptions);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=loaderOptionsPlugin.js.map