"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for output. Finds the output property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param {any} j — jscodeshift API
 * @param {any} ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns {ast} - jscodeshift API
 */
module.exports = function outputTransform(j, ast, webpackProperties, action) {
	function createOutputProperties(p) {
		utils.pushCreateProperty(j, p, "output", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "output");
	}
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createOutputProperties));
		} else if (action === "add") {
			if (utils.findRootNodesByName(j, ast, "output").size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p => utils.pushObjectKeys(j, p, webpackProperties, "output"));
			} else {
				return outputTransform(j, ast, webpackProperties, "init");
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
