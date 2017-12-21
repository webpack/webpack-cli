"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for target. Finds the target property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function targetTransform(j, ast, webpackProperties, action) {
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"target",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const targetNode = utils.findRootNodesByName(j, ast, "target");
			if (targetNode.size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p =>
						utils.checkIfExistsAndAddValue(
							j,
							p,
							"target",
							utils.createIdentifierOrLiteral(j, webpackProperties)
						)
					);
			} else {
				return targetTransform(j, ast, webpackProperties, "init");
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
