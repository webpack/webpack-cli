"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for cache. Finds the cache property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function cacheTransform(j, ast, webpackProperties, action) {
	function createCacheProperty(p) {
		utils.pushCreateProperty(j, p, "cache", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "cache");
	}
	if (webpackProperties || typeof webpackProperties === "boolean") {
		if (action === "init" && typeof webpackProperties === "object") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createCacheProperty));
		} else if (
			action === "init" &&
			(webpackProperties.length || typeof webpackProperties === "boolean")
		) {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"cache",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const cacheNode = utils.findRootNodesByName(j, ast, "cache");
			if (cacheNode.size() !== 0 && typeof webpackProperties === "object") {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"cache"
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
				cacheNode.size() !== 0 &&
				(typeof webpackProperties === "boolean" || webpackProperties.length > 0)
			) {
				return ast
					.find(j.ObjectExpression)
					.filter(p =>
						utils.checkIfExistsAndAddValue(
							j,
							p,
							"cache",
							utils.createIdentifierOrLiteral(j, webpackProperties)
						)
					);
			} else {
				return cacheTransform(j, ast, webpackProperties, "init");
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
