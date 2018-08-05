import * as utils from "@webpack-cli/utils/ast-utils";

import { IJSCodeshift, INode } from "../types/NodePath";

/**
 *
 * Transform which removes the json loader from all possible declarations
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */

export default function(j: IJSCodeshift, ast: INode): INode {
	/**
	 *
	 * Remove the loader with name `name` from the given NodePath
	 *
	 * @param {Node} path - ast to remove the loader from
	 * @param {String} name - the name of the loader to remove
	 * @returns {void}
	 */

	function removeLoaderByName(path: INode, name: string): void {
		const loadersNode: INode = path.value.value;

		switch (loadersNode.type) {
			case j.ArrayExpression.name: {
				const loaders: string[] = loadersNode.elements.map((p: INode): string => {
					return utils.safeTraverse(p, ["properties", "0", "value", "value"]);
				});

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

	function removeLoaders(astNode: INode) {
		astNode
			.find(j.Property, { key: { name: "use" } })
			.forEach((path: INode): void => removeLoaderByName(path, "json-loader"));

		astNode
			.find(j.Property, { key: { name: "loader" } })
			.forEach((path: INode): void => removeLoaderByName(path, "json-loader"));
	}

	const transforms: Array<(astNode: INode) => void> = [removeLoaders];

	transforms.forEach((t: (astNode: INode) => void): void => t(ast));

	return ast;
}
