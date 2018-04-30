const {
	findPluginsByName,
	safeTraverse,
	createProperty,
	getRequire,
	findPluginsArrayAndRemoveIfEmpty
} = require("../../utils/ast-utils");

/**
 *
 * Transform which:
 * - Removes UglifyWebpackPlugin from plugins array, if no options is passed to the plugin.
 *	 and adds `optimization.minimize: true` to config
 *
 * - If any configuration is passed to UglifyWebpackPlugin
 *   plugin instantiation is moved to `optimization.minimizer`.
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

module.exports = function(j, ast) {
	let pluginVariableAssignment;

	const searchForRequirePlugin = ast
		.find(j.VariableDeclarator)
		.filter(
			j.filters.VariableDeclarator.requiresModule("uglifyjs-webpack-plugin")
		);

	/**
	 * Look for a variable declaration which requires uglifyjs-webpack-plugin
	 * saves the name of this variable.
	 */
	searchForRequirePlugin.forEach(node => {
		pluginVariableAssignment = node.value.id.name;
	});

	pluginVariableAssignment = !pluginVariableAssignment
		? "webpack.optimize.UglifyJsPlugin"
		: pluginVariableAssignment;

	findPluginsByName(j, ast, [pluginVariableAssignment]).forEach(node => {
		let expressionContent;
		const configBody = safeTraverse(node, ["parent", "parent", "parent"]);

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
		 * - add require for uglify-webpack-plugin
		 * - add to minimizer
		 */
			if (pluginVariableAssignment.includes("webpack")) {
				// create require for uglify-webpack-plugin
				const pathRequire = getRequire(
					j,
					"UglifyJsPlugin",
					"uglifyjs-webpack-plugin"
				);
				// append to source code.
				ast
					.find(j.Program)
					.replaceWith(p =>
						j.program([].concat(pathRequire).concat(p.value.body))
					);

				expressionContent = j.property(
					"init",
					j.identifier("minimizer"),
					j.arrayExpression([
						j.newExpression(j.identifier("UglifyJsPlugin"), [pluginOptions[0]])
					])
				);
			} else {
				expressionContent = j.property(
					"init",
					j.identifier("minimizer"),
					j.arrayExpression([node.value])
				);
			}
		} else {
			searchForRequirePlugin.forEach(node => j(node).remove());
		}

		const minimizeProperty = createProperty(j, "minimize", "true");
		// creates optimization property at the body of the config.
		if (expressionContent) {
			configBody.value.properties.push(
				j.property(
					"init",
					j.identifier("optimization"),
					j.objectExpression([minimizeProperty, expressionContent])
				)
			);
		} else {
			configBody.value.properties.push(
				j.property(
					"init",
					j.identifier("optimization"),
					j.objectExpression([minimizeProperty])
				)
			);
		}

		// remove the old Uglify plugin from Plugins array.
		j(node).remove();
	});

	findPluginsArrayAndRemoveIfEmpty(j, ast);

	return ast;
};
