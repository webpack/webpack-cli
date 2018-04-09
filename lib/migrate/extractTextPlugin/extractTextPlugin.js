const {
	createOrUpdatePluginByName,
	findPluginsByName,
	getRequire,
	isType,
	safeTraverse
} = require("../../utils/ast-utils");

/**
 *
 * Transform for ExtractTextPlugin. Replaces it with MiniCssExtractPlugin and translates
 * configuration where possible.
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
module.exports = function(j, ast) {
	const loader = j.memberExpression(j.identifier("MiniCssExtractPlugin"), j.identifier("loader"), false);
	const devLoaders = [];
	const prodLoaders = [];

	let loaderPath;
	let pluginExists;
	let requireExists;

	/**
	 * Returns the value of an ExtractTextPlugin loader option
	 * @param {string} name - name of loader option
	 * @param {array} valuePath - used to traverse to value in AST
	 * @param {array} parentPath - validates this option is specific to this loader
	 * @returns {*} - the value of a loader option
	 */
	function getLoaderOption(name, valuePath, parentPath) {
		let value = null;
		ast.find(j.Identifier, { name })
			.filter(path => safeTraverse(path, parentPath))
			.filter(path => j.match(parentPath.reduce((a, b) => a[b], path), { name: "ExtractTextPlugin" }))
			.filter(path => safeTraverse(path, valuePath))
			.forEach(path => {
				value = valuePath.reduce((a, b) => a[b], path);
			});
		return value;
	}

	/**
	 * Sanitizes a path into an array, using path.elements if available
	 * @param {NodePath} path - path to sanitize
	 * @param {Function} action - called with sanitized path
	 * @returns {*} - null
	 */
	function pathSwitch(path, action) {
		if (isType(path, "ArrayExpression")) {
			action(path.elements);
			return;
		}
		action([path]);
	}

	const filename = getLoaderOption(
		"filename",
		["parent", "value", "value", "value"],
		["parent", "parent", "parent", "value", "callee"]);

	const publicPath = getLoaderOption(
		"publicPath",
		["parent", "value", "value", "value"],
		["parent", "parent", "parent", "value", "callee", "object"]);

	const currentFallbackLoader = getLoaderOption(
		"fallback",
		["parent", "value", "value"],
		["parent", "parent", "parent", "value", "callee", "object"]);

	const currentLoader = getLoaderOption(
		"use",
		["parent", "value", "value"],
		["parent", "parent", "parent", "value", "callee", "object"]);

	const loaderOptions = filename || publicPath ? {} : null;
	filename && Object.assign(loaderOptions, { filename });
	publicPath && Object.assign(loaderOptions, { publicPath });

	// Remove require for old plugin
	ast.find(j.Identifier, { name: "ExtractTextPlugin" })
		.filter(path => safeTraverse(path, ["parent", "parent", "value"]))
		.filter(path => isType(path.parent.parent.value, "VariableDeclaration"))
		.forEach(path => {
			j(path.parent.parent).remove();
			requireExists = true;
		});

	// Add require for new plugin
	const pathRequire = getRequire(j, "MiniCssExtractPlugin", "mini-css-extract-plugin");
	requireExists && ast.find(j.Program).replaceWith(p => j.program([].concat(pathRequire).concat(p.value.body)));

	// Remove old plugin
	findPluginsByName(j, ast, ["ExtractTextPlugin"])
		.filter(path => safeTraverse(path, ["parent", "value"]))
		.forEach(path => {
			j(path).remove();
			pluginExists = true;
		});

	// Add new plugin
	pluginExists && ast.find(j.Identifier, { name: "plugins" })
		.filter(path => safeTraverse(path, ["parent", "value"]))
		.forEach(path => {
			createOrUpdatePluginByName(j, path.parent.value, "MiniCssExtractPlugin", loaderOptions);
		});

	// Remove old loader
	ast.find(j.Identifier, { name: "ExtractTextPlugin" })
		.filter(path => safeTraverse(path, ["parent", "value"]))
		.filter(path => isType(path.parent.value, "MemberExpression"))
		.forEach(path => {
			loaderPath = safeTraverse(path, ["parent", "parent", "parent", "value"]);
			j(path.parent.parent).remove();
		});

	// Build loader arrays
	currentLoader && pathSwitch(currentLoader, switchedLoader => {
		prodLoaders.push(loader, ...switchedLoader);
		currentFallbackLoader && pathSwitch(currentFallbackLoader, switchedFallbackLoader => {
			devLoaders.push(...switchedFallbackLoader, ...switchedLoader);
		});
	});

	// Add new loader
	loaderPath && Object.assign(loaderPath, {
		value: currentFallbackLoader ?
			j.conditionalExpression(
				j.binaryExpression(
					"===",
					j.memberExpression(
						j.memberExpression(j.identifier("process"), j.identifier("env"), false),
						j.identifier("NODE_ENV"),
						false
					),
					j.literal("production")
				),
				j.arrayExpression(prodLoaders),
				j.arrayExpression(devLoaders)
			) :
			j.arrayExpression(prodLoaders)
	});

	return ast;
};
