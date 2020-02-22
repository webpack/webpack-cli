"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_utils_1 = require("@webpack-cli/utils/ast-utils");
/**
 *
 * Transform which:
 * Removes UglifyWebpackPlugin from plugins array, if no options is passed to the plugin.
 * and adds `optimization.minimize: true` to config
 *
 * If any configuration is passed to UglifyWebpackPlugin
 * UglifyWebpackPlugin is replaced with TerserPlugin
 * and plugin instantiation is moved to `optimization.minimizer`.
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
function default_1(j, ast) {
    let pluginVariableAssignment = null;
    const searchForRequirePlugin = ast
        .find(j.VariableDeclarator)
        .filter(j.filters.VariableDeclarator.requiresModule("uglifyjs-webpack-plugin"));
    /**
     * Look for a variable declaration which requires uglifyjs-webpack-plugin
     * saves the name of this variable.
     */
    searchForRequirePlugin.forEach((node) => {
        pluginVariableAssignment = node.value.id.name;
    });
    pluginVariableAssignment = !pluginVariableAssignment ? "webpack.optimize.UglifyJsPlugin" : pluginVariableAssignment;
    ast_utils_1.findPluginsByName(j, ast, [pluginVariableAssignment]).forEach((node) => {
        let expressionContent = null;
        const configBody = ast_utils_1.safeTraverse(node, ["parent", "parent", "parent"]);
        // options passed to plugin
        const pluginOptions = node.value.arguments;
        /**
         * check if there are any options passed to UglifyWebpackPlugin
         * If so, they are moved to optimization.minimizer.
         * Otherwise, rely on default options
         */
        if (pluginOptions.length) {
            /*
             * If user is using UglifyJsPlugin directly from webpack
             * transformation must:
             * - remove it
             * - add require for terser-webpack-plugin
             * - add to minimizer
             */
            if (pluginVariableAssignment) {
                // remove require for uglify-webpack-plugin
                searchForRequirePlugin.remove();
                // create require for terser-webpack-plugin
                const pathRequire = ast_utils_1.getRequire(j, "TerserPlugin", "terser-webpack-plugin");
                // prepend to source code.
                ast.find(j.Program).replaceWith((p) => j.program([].concat(pathRequire).concat(p.value.body)));
                expressionContent = j.property("init", j.identifier("minimizer"), j.arrayExpression([j.newExpression(j.identifier("TerserPlugin"), [pluginOptions[0]])]));
            }
            else {
                expressionContent = j.property("init", j.identifier("minimizer"), j.arrayExpression([node.value]));
            }
        }
        else {
            searchForRequirePlugin.forEach((n) => j(n).remove());
        }
        const minimizeProperty = ast_utils_1.createProperty(j, "minimize", "true");
        // creates optimization property at the body of the config.
        if (expressionContent) {
            configBody.value.properties.push(j.property("init", j.identifier("optimization"), j.objectExpression([minimizeProperty, expressionContent])));
        }
        else {
            configBody.value.properties.push(j.property("init", j.identifier("optimization"), j.objectExpression([minimizeProperty])));
        }
        // remove the old Uglify plugin from Plugins array.
        j(node).remove();
    });
    ast_utils_1.findPluginsArrayAndRemoveIfEmpty(j, ast);
    return ast;
}
exports.default = default_1;
//# sourceMappingURL=uglifyJsPlugin.js.map