import * as utils from "./ast-utils";
import { IJSCodeshift, INode, valueType } from "./types/NodePath";

export default function recursiveTransform(
	j: IJSCodeshift, ast: INode, key: string, value: valueType, action: string,
): boolean | INode {
	if (key === "topScope") {
		if (Array.isArray(value)) {
			return utils.parseTopScope(j, ast, value, action);
		}
		console.error("Error in parsing top scope, Array required");
		return false;
	} else if (key === "merge") {
		if (typeof value === "string") {
			return utils.parseMerge(j, ast, value, action);
		}
	}
	const node: INode = utils.findRootNodesByName(j, ast, key);

	// get module.exports prop
	const root = ast
		.find(j.ObjectExpression)
		.filter((p: INode): boolean => {
			return (
				utils.safeTraverse(p, [
					"parentPath",
					"value",
					"left",
					"object",
					"name",
				]) === "module" &&
				utils.safeTraverse(p, [
					"parentPath",
					"value",
					"left",
					"property",
					"name",
				]) === "exports"
			);
		})
		.filter((p: INode): boolean => p.value.properties);

	if (node.size() !== 0) {
		if (action === "add") {
			return utils.findRootNodesByName(j, root, key)
				.forEach((p: INode) => {
					j(p).replaceWith(utils.addProperty(j, p, key, value, action));
				});
		} else if (action === "remove") {
			return utils.removeProperty(j, root, key, value);
		}
	} else {
		return root.forEach((p: INode) => {
			if (value) {
				// init, add new property
				utils.addProperty(j, p, key, value, null);
			}
		});
	}
}
