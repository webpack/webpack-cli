import {
	createProperty,
	findPluginsArrayAndRemoveIfEmpty,
	findPluginsByName,
	getRequire,
	safeTraverse,
} from "@webpack-cli/utils/ast-utils";

import { IJSCodeshift, INode } from "../types/NodePath";

/**
 *
 * Transform which:
 * Removes UglifyWebpackPlugin from plugins array, if no options is passed to the plugin.
 * and adds `optimization.minimize: true` to config
 *
 * If any configuration is passed to UglifyWebpackPlugin
 * plugin instantiation is moved to `optimization.minimizer`.
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

export default function(j: IJSCodeshift, ast: INode): INode {

	let pluginVariableAssignment: string = null;

	const searchForRequirePlugin: INode = ast
		.find(j.VariableDeclarator)
		.filter(
			j.filters.VariableDeclarator.requiresModule("terser-webpack-plugin"),
		);

	/**
	 * Look for a variable declaration which requires terser-webpack-plugin
	 * saves the name of this variable.
	 */
	searchForRequirePlugin.forEach((node: INode): void => {
		pluginVariableAssignment = node.value.id.name;
	});

	pluginVariableAssignment = !pluginVariableAssignment
		? "webpack.optimize.TerserPlugin"
		: pluginVariableAssignment;

	findPluginsByName(j, ast, [pluginVariableAssignment])
		.forEach((node: INode): void => {
			let expressionContent: object = null;

			const configBody: INode = safeTraverse(node, ["parent", "parent", "parent"]);

			// options passed to plugin
			const pluginOptions: INode[] = node.value.arguments;

			/**
			 * check if there are any options passed to UglifyWebpackPlugin
			 * If so, they are moved to optimization.minimizer.
			 * Otherwise, rely on default options
			 */
			if (pluginOptions.length) {
				/*
			* If user is using TerserPlugin directly from webpack
			* transformation must:
			* - remove it
			* - add require for uglify-webpack-plugin
			* - add to minimizer
			*/
				if (pluginVariableAssignment && pluginVariableAssignment.includes("webpack")) {
					// create require for uglify-webpack-plugin
					const pathRequire: INode = getRequire(
						j,
						"TerserPlugin",
						"terser-webpack-plugin",
					);
					// append to source code.
					ast
						.find(j.Program)
						.replaceWith((p: INode): INode =>
							j.program([].concat(pathRequire).concat(p.value.body)),
						);

					expressionContent = j.property(
						"init",
						j.identifier("minimizer"),
						j.arrayExpression([
							j.newExpression(j.identifier("TerserPlugin"), [pluginOptions[0]]),
						]),
					);
				} else {
					expressionContent = j.property(
						"init",
						j.identifier("minimizer"),
						j.arrayExpression([node.value]),
					);
				}
			} else {
				searchForRequirePlugin.forEach((n: INode): void => j(n).remove());
			}

			const minimizeProperty = createProperty(j, "minimize", "true");
			// creates optimization property at the body of the config.
			if (expressionContent) {
				configBody.value.properties.push(
					j.property(
						"init",
						j.identifier("optimization"),
						j.objectExpression([minimizeProperty, expressionContent]),
					),
				);
			} else {
				configBody.value.properties.push(
					j.property(
						"init",
						j.identifier("optimization"),
						j.objectExpression([minimizeProperty]),
					),
				);
			}

			// remove the old Uglify plugin from Plugins array.
			j(node).remove();
		});

	findPluginsArrayAndRemoveIfEmpty(j, ast);

	return ast;
}
