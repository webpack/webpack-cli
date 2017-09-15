"use strict";

const utils = require("../../../transformations/utils");

/*
*
* Transform for module. Finds the module property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createModuleProperties(p) {
		utils.pushCreateProperty(j, p, "module", j.objectExpression([]));
		return utils.safeTraverse(p, ["key", "name"] === "module");
	}
	function createRules(p) {
		return utils.pushObjectKeys(j, p, webpackProperties, "module");
	}
	if (!webpackProperties) {
		return ast;
	} else {
		return ast
			.find(j.ObjectExpression)
			.filter(p => utils.isAssignment(null, p, createModuleProperties))
			.forEach(p => createRules(p));
	}
};
