"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for profile. Finds the profile property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function profileTransform(j, ast, webpackProperties, action) {
	function createProfileProperty(p) {
		utils.pushCreateProperty(j, p, "profile", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "profile");
	}
	if (webpackProperties || typeof webpackProperties === "boolean") {
		if (action === "init" && typeof webpackProperties === "object") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createProfileProperty));
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
						"profile",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const profileNode = utils.findRootNodesByName(j, ast, "profile");
			if (profileNode.size() !== 0 && typeof webpackProperties === "object") {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"profile"
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
				profileNode.size() !== 0 &&
				(typeof webpackProperties === "boolean" || webpackProperties.length > 0)
			) {
				return ast
					.find(j.ObjectExpression)
					.filter(p =>
						utils.checkIfExistsAndAddValue(
							j,
							p,
							"profile",
							utils.createIdentifierOrLiteral(j, webpackProperties)
						)
					);
			} else {
				return profileTransform(j, ast, webpackProperties, "init");
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
