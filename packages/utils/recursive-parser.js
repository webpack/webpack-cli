"use strict";

const utils = require("./ast-utils");

module.exports = function recursiveTransform(j, ast, key, value, action) {
	if (key === "topScope") {
		return utils.parseTopScope(j, ast, value, action);
	} else if (key === "merge") {
		return utils.parseMerge(j, ast, value, action);
	}
	const node = utils.findRootNodesByName(j, ast, key);

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

	if (node.size() !== 0) {
		// select node with existing key
		return utils.findRootNodesByName(j, root, key).forEach(p => {
			if (action === "add") {
				// update property/replace
				j(p).replaceWith(utils.addProperty(j, p, key, value, action));
			}
		});
	} else {
		return root.forEach(p => {
			if (value) {
				// init, add new property
				utils.addProperty(j, p, key, value);
			}
		});
	}
};
