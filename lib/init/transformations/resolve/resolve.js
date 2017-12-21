"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for resolve. Finds the resolve property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function resolveTransform(j, ast, webpackProperties, action) {
	function createResolveProperty(p) {
		if (typeof webpackProperties === "string") {
			return utils.pushCreateProperty(j, p, "resolve", webpackProperties);
		}
		if (Array.isArray(webpackProperties)) {
			const externalArray = utils.createArrayWithChildren(
				j,
				"resolve",
				webpackProperties,
				true
			);
			return p.value.properties.push(externalArray);
		} else {
			utils.pushCreateProperty(j, p, "resolve", j.objectExpression([]));
			return utils.pushObjectKeys(j, p, webpackProperties, "resolve");
		}
	}
	function editResolveProperty(p) {
		return utils.pushObjectKeys(j, p, webpackProperties, "resolve", true);
	}
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createResolveProperty));
		} else if (action === "add") {
			const resolveNode = utils.findRootNodesByName(j, ast, "resolve");
			if (resolveNode.size() !== 0 && typeof webpackProperties === "object") {
				return ast
					.find(j.ObjectExpression)
					.filter(p => utils.isAssignment(null, p, editResolveProperty));
			} else if (resolveNode.size() !== 0 && webpackProperties.length) {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"resolve"
					)
					.forEach(p => {
						j(p).replaceWith(
							utils.createIdentifierOrLiteral(j, webpackProperties)
						);
					});
			} else {
				return resolveTransform(j, ast, webpackProperties, "init");
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
