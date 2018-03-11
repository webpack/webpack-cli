"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for entry. Finds the entry property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param	j	 						- jscodeshift API
 * @param	ast 						- jscodeshift API
 * @param	{any} webpackProperties 	- transformation object to scaffold
 * @param	{String} action 			- action that indicates what to be done to the AST
 * @returns ast 						- jscodeshift API
 */

module.exports = function entryTransform(j, ast, webpackProperties, action) {
	function createEntryProperty(p) {
		if (typeof webpackProperties === "string") {
			return utils.pushCreateProperty(j, p, "entry", webpackProperties);
		}
		if (Array.isArray(webpackProperties)) {
			const externalArray = utils.createArrayWithChildren(
				j,
				"entry",
				webpackProperties,
				true
			);
			return p.value.properties.push(externalArray);
		} else {
			utils.pushCreateProperty(j, p, "entry", j.objectExpression([]));
			return utils.pushObjectKeys(j, p, webpackProperties, "entry");
		}
	}
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createEntryProperty));
		} else if (action === "add") {
			const entryNode = utils.findRootNodesByName(j, ast, "entry");
			if (entryNode.size() !== 0 && typeof webpackProperties === "object") {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"entry"
					)
					.filter(p => {
						Object.keys(webpackProperties).forEach(prop => {
							utils.checkIfExistsAndAddValue(
								j,
								p,
								prop,
								utils.createIdentifierOrLiteral(j, webpackProperties[prop])
							);
						});
						return ast;
					});
			} else if (entryNode.size() !== 0 && webpackProperties.length) {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"entry"
					)
					.forEach(p => {
						j(p).replaceWith(
							utils.createIdentifierOrLiteral(j, webpackProperties)
						);
					});
			} else {
				return entryTransform(j, ast, webpackProperties, "init");
			}
		} else if (action === "remove") {
			// TODO
		} else if (action === "update") {
			// TODO
		}
	} else {
		return ast;
	}
};
