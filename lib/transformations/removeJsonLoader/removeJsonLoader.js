// @flow
import type { Ijscodeshit, IPath, ILiteral, IArrayExpression } from "../../types"; // eslint-disable-line node/no-unsupported-features
const utils = require("../utils");

module.exports = function(j: Ijscodeshit, ast: IPath<*>) {
	function removeLoaderByName(path: IPath<*>, name: string) {
		const loadersNode: Object = path.value.value;
		switch (loadersNode.type) {
			case j.ArrayExpression.name: {
				let loaders = (loadersNode: IArrayExpression).elements.map(p => {
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
				if ((loadersNode: ILiteral).value === name) {
					j(path.parent).remove();
				}
				break;
			}
		}
	}

	function removeLoaders(ast: IPath<*>) {
		ast
			.find(j.Property, { key: { name: "use" } })
			.forEach((path: IPath<*>) => removeLoaderByName(path, "json-loader"));

		ast
			.find(j.Property, { key: { name: "loader" } })
			.forEach((path: IPath<*>) => removeLoaderByName(path, "json-loader"));
	}

	const transforms = [
		removeLoaders
	];

	transforms.forEach(t => t(ast));

	return ast;
};
