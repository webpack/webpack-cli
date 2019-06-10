import {
	createProperty,
	findPluginsArrayAndRemoveIfEmpty,
	findPluginsByName,
	getRequire,
	safeTraverse
} from "@webpack-cli/utils/ast-utils";

import { JSCodeshift, Node } from "../types/NodePath";

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

export default function(j: JSCodeshift, ast: Node): Node {
	let pluginVariableAssignment: string = null;

	const searchForRequirePlugin: Node = ast
		.find(j.VariableDeclarator)
		.filter(j.filters.VariableDeclarator.requiresModule("uglifyjs-webpack-plugin"));

	/**
	 * Look for a variable declaration which requires uglifyjs-webpack-plugin
	 * saves the name of this variable.
	 */
	searchForRequirePlugin.forEach((node: Node): void => {
		pluginVariableAssignment = (node.value as Node).id.name;
	});

	pluginVariableAssignment = !pluginVariableAssignment ? "webpack.optimize.UglifyJsPlugin" : pluginVariableAssignment;

	findPluginsByName(j, ast, [pluginVariableAssignment]).forEach((node: Node): void => {
		let expressionContent: object = null;

		const configBody = safeTraverse(node, ["parent", "parent", "parent"]);

		// options passed to plugin
		const pluginOptions: Node[] = (node.value as Node).arguments;

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
				const pathRequire: Node = getRequire(j, "TerserPlugin", "terser-webpack-plugin");
				// prepend to source code.
				ast.find(j.Program).replaceWith(
					(p: Node): Node => j.program([].concat(pathRequire).concat((p.value as Node).body))
				);

				expressionContent = j.property(
					"init",
					j.identifier("minimizer"),
					j.arrayExpression([j.newExpression(j.identifier("TerserPlugin"), [pluginOptions[0]])])
				);
			} else {
				expressionContent = j.property(
					"init",
					j.identifier("minimizer"),
					j.arrayExpression([node.value as Node])
				);
			}
		} else {
			searchForRequirePlugin.forEach((n: Node): void => j(n).remove());
		}

		const minimizeProperty = createProperty(j, "minimize", "true");
		// creates optimization property at the body of the config.
		if (expressionContent) {
			((configBody as Node).value as Node).properties.push(
				j.property(
					"init",
					j.identifier("optimization"),
					j.objectExpression([minimizeProperty, expressionContent])
				)
			);
		} else {
			((configBody as Node).value as Node).properties.push(
				j.property("init", j.identifier("optimization"), j.objectExpression([minimizeProperty]))
			);
		}

		// remove the old Uglify plugin from Plugins array.
		j(node).remove();
	});

	findPluginsArrayAndRemoveIfEmpty(j, ast);

	return ast;
}
