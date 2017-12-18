"use strict";

const utils = require("../../../utils/ast-utils");

/**
 *
 * Transform for module. Finds the module property from yeoman and creates a
 * property based on what the user has given us.
 *
 * @param j — jscodeshift API
 * @param ast - jscodeshift API
 * @param {any} webpackProperties - transformation object to scaffold
 * @param {String} action - action that indicates what to be done to the AST
 * @returns ast - jscodeshift API
 */

module.exports = function(j, ast, webpackProperties, action) {
	function createModuleProperties(p) {
		utils.pushCreateProperty(j, p, "module", j.objectExpression([]));
		return utils.safeTraverse(p, ["key", "name"] === "module");
	}
	function createRules(p) {
		return utils.pushObjectKeys(j, p, webpackProperties, "module");
	}
	if (webpackProperties && action === "init") {
		return ast
			.find(j.ObjectExpression)
			.filter(p => utils.isAssignment(null, p, createModuleProperties))
			.forEach(p => createRules(p));
	} else {
		return ast;
	}
};
