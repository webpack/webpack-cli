const utils = require("../../utils/ast-utils");

/**
 *
 * Transform which removes the json loader from all possible declarations
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

module.exports = function(j, ast) {
	/**
	 *
	 * Remove the loader with name `name` from the given NodePath
	 *
	 * @param {Node} path - ast to remove the loader from
	 * @param {String} name - the name of the loader to remove
	 *
	 */

	function removeLoaderByName(path, name) {
		const loadersNode = path.value.value;
		switch (loadersNode.type) {
			case j.ArrayExpression.name: {
				let loaders = loadersNode.elements.map(p => {
					return utils.safeTraverse(p, ["properties", "0", "value", "value"]);
				});
				const loaderIndex = loaders.indexOf(name);
				if (loaders.length && loaderIndex > -1) {
					// Remove loader from the array
					loaders.splice(loaderIndex, 1);
					// and from AST
					loadersNode.elements.splice(loaderIndex, 1);
				}

				// If there are no loaders left, remove the whole Rule object
				if (loaders.length === 0) {
					j(path.parent).remove();
				}
				break;
			}
			case j.Literal.name: {
				// If only the loader with the matching name was used
				// we can remove the whole Property node completely
				if (loadersNode.value === name) {
					j(path.parent).remove();
				}
				break;
			}
		}
	}

	function removeLoaders(ast) {
		ast
			.find(j.Property, { key: { name: "use" } })
			.forEach(path => removeLoaderByName(path, "json-loader"));

		ast
			.find(j.Property, { key: { name: "loader" } })
			.forEach(path => removeLoaderByName(path, "json-loader"));
	}

	const transforms = [removeLoaders];

	transforms.forEach(t => t(ast));

	return ast;
};
