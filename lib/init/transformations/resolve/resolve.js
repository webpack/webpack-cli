"use strict";

const utils = require("../../../utils/ast-utils");

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

module.exports = function resolveTransform(j, ast, webpackProperties, action) {
	function createResolveProperties(p) {
		utils.pushCreateProperty(j, p, "resolve", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "resolve");
	}
	if (webpackProperties) {
		if (action === "init") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createResolveProperties));
		} else if (action === "add") {
			if (utils.findRootNodesByName(j, ast, "resolve").size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p =>
						utils.pushObjectKeys(j, p, webpackProperties, "resolve")
					);
			} else {
				return resolveTransform(j, ast, webpackProperties, "init");
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
