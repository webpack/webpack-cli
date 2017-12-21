"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for amd. Finds the amd property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function amdTransform(j, ast, webpackProperties, action) {
	function createAmdProperty(p) {
		utils.pushCreateProperty(j, p, "amd", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "amd");
	}
	if (webpackProperties) {
		if (action === "init" && typeof webpackProperties === "object") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createAmdProperty));
		} else if (action === "init" && webpackProperties.length) {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"amd",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const amdNode = utils.findRootNodesByName(j, ast, "amd");
			if (amdNode.size() !== 0 && typeof webpackProperties === "object") {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"amd"
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
			} else if (amdNode.size() !== 0 && webpackProperties.length) {
				return ast
					.find(j.ObjectExpression)
					.filter(
						p =>
							utils.safeTraverse(p, ["parentPath", "value", "key", "name"]) ===
							"amd"
					)
					.forEach(p => {
						j(p).replaceWith(
							utils.createIdentifierOrLiteral(j, webpackProperties)
						);
					});
			} else {
				return amdTransform(j, ast, webpackProperties, "init");
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
