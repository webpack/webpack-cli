"use strict";

const utils = require("../../../transformations/utils");

/*
*
* Transform for amd. Finds the amd property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createAMDProperty(p) {
		utils.pushCreateProperty(j, p, "amd", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "amd");
	}
	if (webpackProperties && typeof webpackProperties === "object") {
		return ast
			.find(j.ObjectExpression)
			.filter(p => utils.isAssignment(null, p, createAMDProperty));
	} else {
		return ast;
	}
};
