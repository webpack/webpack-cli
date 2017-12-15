"use strict";

const utils = require("../../../utils/ast-utils");

/*
*
* Transform for performance. Finds the performance property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function performanceTransform(
	j,
	ast,
	webpackProperties,
	action
) {
	function createPerformanceProperty(p) {
		utils.pushCreateProperty(j, p, "performance", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "performance");
	}
	if (webpackProperties && typeof webpackProperties === "object") {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createPerformanceProperty));
		} else if (action === "add") {
			if (utils.findRootNodesByName(j, ast, "performance").size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p =>
						utils.pushObjectKeys(j, p, webpackProperties, "performance")
					);
			} else {
				return performanceTransform(j, ast, webpackProperties, "init");
			}
		} else if (action === "remove") {
			// TODO
		} else if (action === "update") {
			// TODO
		}
	} else {
		return ast;
	}
};
