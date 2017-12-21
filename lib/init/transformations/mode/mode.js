"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for mode. Finds the mode property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function modeTransform(j, ast, webpackProperties, action) {
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"mode",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const modeNode = utils.findRootNodesByName(j, ast, "mode");
			if (modeNode.size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p =>
						utils.checkIfExistsAndAddValue(
							j,
							p,
							"mode",
							utils.createIdentifierOrLiteral(j, webpackProperties)
						)
					);
			} else {
				return modeTransform(j, ast, webpackProperties, "init");
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
