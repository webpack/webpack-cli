"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for bail. Finds the bail property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function bailTransform(j, ast, webpackProperties, action) {
	if (webpackProperties || typeof webpackProperties === "boolean") {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"bail",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const bailNode = utils.findRootNodesByName(j, ast, "bail");
			if (bailNode.size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p =>
						utils.checkIfExistsAndAddValue(
							j,
							p,
							"bail",
							utils.createIdentifierOrLiteral(j, webpackProperties)
						)
					);
			} else {
				return bailTransform(j, ast, webpackProperties, "init");
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
