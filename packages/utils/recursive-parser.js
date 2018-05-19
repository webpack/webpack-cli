"use strict";

const utils = require("./ast-utils");

module.exports = function recursiveTransform(j, ast, key, value, action) {
	if (key === "topScope") {
		return utils.parseTopScope(j, ast, value, action);
	} else if (key === "merge") {
		return utils.parseMerge(j, ast, value, action);
	}
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
			if (value) {
				utils.addProperty(j, p, key, value);
			}
		});
	}
};
