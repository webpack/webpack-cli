"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for node. Finds the node property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function nodeTransform(j, ast, webpackProperties, action) {
	function createNodeProperty(p) {
		utils.pushCreateProperty(j, p, "node", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "node");
	}
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createNodeProperty));
		} else if (action === "add") {
			const nodeNode = utils.findRootNodesByName(j, ast, "node");
			if (nodeNode.size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p => utils.pushObjectKeys(j, p, webpackProperties, "node"));
			} else {
				return nodeTransform(j, ast, webpackProperties, "init");
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
