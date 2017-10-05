"use strict";

const utils = require("../../../transformations/utils");

/*
*
* Transform for devServer. Finds the devServer property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createDevServerProperty(p) {
		utils.pushCreateProperty(j, p, "devServer", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "devServer");
	}
	if (webpackProperties && typeof webpackProperties === "object") {
		return ast
			.find(j.ObjectExpression)
			.filter(p => utils.isAssignment(null, p, createDevServerProperty));
	} else if (webpackProperties && webpackProperties.length) {
		return ast
			.find(j.ObjectExpression)
			.filter(p =>
				utils.isAssignment(
					j,
					p,
					utils.pushCreateProperty,
					"devServer",
					webpackProperties
				)
			);
	} else {
		return ast;
	}
};
