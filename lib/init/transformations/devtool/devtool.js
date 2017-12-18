"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for devtool. Finds the devtool property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function devToolTransform(j, ast, webpackProperties, action) {
	if (webpackProperties || typeof webpackProperties === "boolean") {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"devtool",
						webpackProperties
					)
				);
		} else if (action === "add") {
			const devToolNode = utils.findRootNodesByName(j, ast, "devtool");
			if (devToolNode.size() !== 0) {
				return devToolNode.forEach(p => {
					j(p).replaceWith(
						j.property(
							"init",
							j.identifier("devtool"),
							utils.createIdentifierOrLiteral(j, webpackProperties)
						)
					);
				});
			} else {
				return devToolTransform(j, ast, webpackProperties, "init");
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
