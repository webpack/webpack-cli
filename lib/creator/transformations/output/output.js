"use strict";

const utils = require("../../../transformations/utils");

/*
*
* Transform for output. Finds the output property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/
module.exports = function(j, ast, webpackProperties) {
	function createOutputProperties(p) {
		utils.pushCreateProperty(j, p, "output", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "output");
	}
	if (webpackProperties) {
		return ast
			.find(j.ObjectExpression)
			.filter(p => utils.isAssignment(null, p, createOutputProperties));
	} else {
		return ast;
	}
};
