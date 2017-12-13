"use strict";

const utils = require("../../../utils/ast-utils");

/*
*
* Transform for cache. Finds the cache property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties, action) {
	if (webpackProperties && action === "init") {
		return ast
			.find(j.ObjectExpression)
			.filter(p =>
				utils.isAssignment(
					j,
					p,
					utils.pushCreateProperty,
					"cache",
					webpackProperties
				)
			);
	} else {
		return ast;
	}
};
