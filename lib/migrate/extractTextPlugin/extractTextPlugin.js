const {
	addRequire,
	createPluginByName,
	removePluginByName,
	getLoaderOptionValue,
	getPluginOptionValue,
	isType,
	pathToArray,
	removeRequire,
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
	const devLoaders = [];
	const prodLoaders = [];

	let elements;
	let loaderIndex;
	let loaderPath;
	let newElements;
	let pluginExists;
	let requireExists;

	const filename = getPluginOptionValue(j, ast, "ExtractTextPlugin", "filename");
	const publicPath = getLoaderOptionValue(j, ast, "ExtractTextPlugin", "publicPath");
	const currentFallbackLoader = getLoaderOptionValue(j, ast, "ExtractTextPlugin", "fallback");
	const currentLoader = getLoaderOptionValue(j, ast, "ExtractTextPlugin", "use");

	const loaderOptions = filename || publicPath ? {} : null;
	filename && Object.assign(loaderOptions, { filename });
	publicPath && Object.assign(loaderOptions, { publicPath: publicPath.value });

	// Remove require for old plugin
	requireExists = removeRequire(j, ast, "ExtractTextPlugin");

	// Add require for new plugin
	requireExists && addRequire(j, ast, "MiniCssExtractPlugin", "mini-css-extract-plugin");

	// Remove old plugin
	pluginExists = removePluginByName(j, ast, "ExtractTextPlugin");

	// Add new plugin
	pluginExists && createPluginByName(j, ast, "MiniCssExtractPlugin", loaderOptions);

	// Remove old loader
	ast.find(j.Identifier, { name: "ExtractTextPlugin" })
		.filter(path => safeTraverse(path, ["parent", "value"]))
		.filter(path => isType(path.parent.value, "MemberExpression"))
		.forEach(path => {
			loaderPath = safeTraverse(path, ["parent", "parent", "parent", "value"]);
			loaderPath.elements && (elements = [...loaderPath.elements]);
			j(path.parent.parent).remove();
		});

	// Build loader arrays
	currentLoader && pathToArray(currentLoader, switchedLoader => {
		const loader = j.memberExpression(j.identifier("MiniCssExtractPlugin"), j.identifier("loader"), false);
		prodLoaders.push(loader, ...switchedLoader);
		currentFallbackLoader && pathToArray(currentFallbackLoader, switchedFallbackLoader => {
			devLoaders.push(...switchedFallbackLoader, ...switchedLoader);
		});
	});

	// Add new loader
	const loader = currentFallbackLoader ?
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
		j.arrayExpression(prodLoaders);

	if (loaderPath) {
		switch (loaderPath.type) {
			case "CallExpression":
				loaderPath.arguments = [loader];
				break;
			case "Property":
				loaderPath.value = loader;
				break;
			case "ArrayExpression":
				loaderIndex = elements.findIndex(e => e.callee && e.callee.object.name === "ExtractTextPlugin");
				newElements = [
					...elements.slice(0, loaderIndex),
					loader,
					...elements.slice(loaderIndex + 1)
				];
				loaderPath.elements = newElements;
				break;
		}
	}

	return ast;
};
