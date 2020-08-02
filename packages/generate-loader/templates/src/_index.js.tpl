/**
 * See the webpack docs for more information about loaders:
 * https://webpack.js.org/contribute/writing-a-loader
 */

module.exports = function loader(source) {
	const { loaders, resource, request, version, webpack } = this;
	console.log('<%= name %>');
	const newSource = `
	/**
	 * <%= name %>
	 *
	 * Resource Location: ${resource}
	 * Loaders chained to module: ${JSON.stringify(loaders)}
	 * Loader API Version: ${version}
	 * Is this in "webpack mode": ${webpack}
	 * This is the users request for the module: ${request}
	 */
	/**
	 * Original Source From Loader
	 */
	${source}`;

	return newSource;
}
