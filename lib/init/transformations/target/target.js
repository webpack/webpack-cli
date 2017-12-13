"use strict";

const utils = require("../../../utils/ast-utils");

/*
*
* Transform for target. Finds the target property from yeoman and creates a
* property based on what the user has given us.
*
* @param j — jscodeshift API
* @param ast - jscodeshift API
* @param { Object } webpackProperties - Object containing transformation rules
* @returns ast - jscodeshift API
*/

module.exports = function targetTransform(j, ast, webpackProperties, action) {
	if (webpackProperties && webpackProperties.length) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p =>
					utils.isAssignment(
						j,
						p,
						utils.pushCreateProperty,
						"target",
						webpackProperties
					)
				);
		} else if (action === "add") {
			if (utils.findRootNodesByName(j, ast, "target").size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p => utils.pushObjectKeys(j, p, webpackProperties, "target"));
			} else {
				return targetTransform(j, ast, webpackProperties, "init");
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
