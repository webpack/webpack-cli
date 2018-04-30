"use strict";

const utils = require("../utils/ast-utils");

module.exports = function astTransform(j, ast, value, action, key) {
	const node = utils.findRootNodesByName(j, ast, key);
	if (node.size() !== 0) {
		// push to existing key
		return ast;
	} else {
		// get module.exports prop
		const root = ast
			.find(j.ObjectExpression)
			.filter(p => {
				return (
					utils.safeTraverse(p, [
						"parentPath",
						"value",
						"left",
						"object",
						"name"
					]) === "module" &&
					utils.safeTraverse(p, [
						"parentPath",
						"value",
						"left",
						"property",
						"name"
					]) === "exports"
				);
			})
			.filter(p => p.value.properties);
		return root.forEach(p => {
			utils.addProperty(j, p, key, value);
		});
	}
};
