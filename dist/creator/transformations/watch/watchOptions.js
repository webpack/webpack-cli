"use strict";

const utils = require("../../../transformations/utils");

/*
*
* Transform for watchOptions. Finds the watchOptions property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createWatchOptionsProperty(p) {
		utils.pushCreateProperty(j, p, "watchOptions", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "watchOptions");
	}
	if (webpackProperties) {
		return ast
			.find(j.ObjectExpression)
			.filter(p => utils.isAssignment(null, p, createWatchOptionsProperty));
	} else {
		return ast;
	}
};
