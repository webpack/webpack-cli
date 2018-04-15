"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for optimization. Finds the optimization property from yeoman and creates a
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
		utils.pushCreateProperty(j, p, "optimization", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "optimization");
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
						"optimization",
						webpackProperties
					)
				);
		} else if (action === "add") {
			// TODO
		} else if (action === "remove") {
			// TODO
		} else if (action === "update") {
			// TODO
		}
	} else {
		return ast;
	}
};
