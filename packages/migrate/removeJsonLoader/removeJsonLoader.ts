import * as utils from "@webpack-cli/utils/ast-utils";

import { JSCodeshift, Node } from "../types/NodePath";

type TransformCallback = (astNode: Node) => void;

/**
 *
 * Transform which removes the json loader from all possible declarations
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

export default function(j: JSCodeshift, ast: Node): Node {
	/**
	 *
	 * Remove the loader with name `name` from the given NodePath
	 *
	 * @param {Node} path - ast to remove the loader from
	 * @param {String} name - the name of the loader to remove
	 * @returns {void}
	 */

	function removeLoaderByName(path: Node, name: string): void {
		const loadersNode = (path.value as Node).value as Node;

		switch (loadersNode.type) {
			case j.ArrayExpression.name: {
				const loaders: Node[] = loadersNode.elements.map(
					(p: Node): Node => {
						return utils.safeTraverse(p, ["properties", "0", "value", "value"]) as Node;
					}
				);

				const loaderIndex: number = loaders.indexOf(name);
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

	function removeLoaders(astNode: Node): void {
		astNode
			.find(j.Property, { key: { name: "use" } })
			.forEach((path: Node): void => removeLoaderByName(path, "json-loader"));

		astNode
			.find(j.Property, { key: { name: "loader" } })
			.forEach((path: Node): void => removeLoaderByName(path, "json-loader"));
	}

	const transforms: TransformCallback[] = [removeLoaders];

	transforms.forEach((t: TransformCallback): void => t(ast));

	return ast;
}
