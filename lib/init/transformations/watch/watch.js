"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for watch. Finds the watch property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function watchTransform(j, ast, webpackProperties, action) {
	function createWatchProperty(p) {
		utils.pushCreateProperty(j, p, "watch", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "watch");
	}
	if (webpackProperties || typeof webpackProperties === "boolean") {
		if (action === "init" && typeof webpackProperties === "object") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createWatchProperty));
		} else if (action === "init" && typeof webpackProperties === "boolean") {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"watch",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const watchNode = utils.findRootNodesByName(j, ast, "watch");
			if (watchNode.size() !== 0 && typeof webpackProperties === "object") {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"watch"
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
			} else if (
				watchNode.size() !== 0 &&
				(webpackProperties.length || typeof webpackProperties === "boolean")
			) {
				return ast
					.find(j.ObjectExpression)
					.filter(p =>
						utils.checkIfExistsAndAddValue(
							j,
							p,
							"watch",
							utils.createIdentifierOrLiteral(j, webpackProperties)
						)
					);
			} else {
				return watchTransform(j, ast, webpackProperties, "init");
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
