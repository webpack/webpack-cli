"use strict";

const utils = require("../../../transformations/utils");

/*
*
* Transform for watch. Finds the watch property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	if (typeof webpackProperties === "boolean") {
		return ast
			.find(j.ObjectExpression)
			.filter(p =>
				utils.isAssignment(
					j,
					p,
					utils.pushCreateProperty,
					"watch",
					webpackProperties
				)
			);
	} else {
		return ast;
	}
};
