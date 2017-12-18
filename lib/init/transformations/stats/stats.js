"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for stats. Finds the stats property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function statsTransform(j, ast, webpackProperties, action) {
	function createStatsProperty(p) {
		utils.pushCreateProperty(j, p, "stats", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "stats");
	}
	if (webpackProperties) {
		if (action === "init" && typeof webpackProperties === "object") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createStatsProperty));
		} else if (action === "init" && webpackProperties.length) {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"stats",
						webpackProperties
					)
				);
		} else if (action === "add") {
			if (utils.findRootNodesByName(j, ast, "stats").size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p => utils.pushObjectKeys(j, p, webpackProperties, "stats"));
			} else {
				return statsTransform(j, ast, webpackProperties, "init");
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
