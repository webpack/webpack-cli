"use strict";

const utils = require("../../../transformations/utils");

/*
*
* Transform for resolve. Finds the resolve property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createResolveProperties(p) {
		utils.pushCreateProperty(j, p, "resolve", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "resolve");
	}
	if (webpackProperties) {
		return ast
			.find(j.ObjectExpression)
			.filter(p => utils.isAssignment(null, p, createResolveProperties));
	} else {
		return ast;
	}
};
