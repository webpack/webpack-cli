"use strict";

const utils = require("../../../transformations/utils");

/*
*
* Transform for stats. Finds the stats property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function(j, ast, webpackProperties) {
	function createStatsProperty(p) {
		utils.pushCreateProperty(j, p, "stats", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "stats");
	}
	if (webpackProperties && typeof webpackProperties === "object") {
		return ast
			.find(j.ObjectExpression)
			.filter(p => utils.isAssignment(null, p, createStatsProperty));
	} else if (webpackProperties && webpackProperties.length) {
		return ast
			.find(j.ObjectExpression)
			.filter(p =>
				utils.isAssignment(
					j,
					p,
					utils.pushCreateProperty,
					"stats",
					webpackProperties
				)
			);
	} else {
		return ast;
	}
};
