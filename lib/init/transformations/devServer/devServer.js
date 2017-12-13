"use strict";

const utils = require("../../../utils/ast-utils");

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

module.exports = function devServerTransform(
	j,
	ast,
	webpackProperties,
	action
) {
	function createDevServerProperty(p) {
		utils.pushCreateProperty(j, p, "devServer", j.objectExpression([]));
		return utils.pushObjectKeys(j, p, webpackProperties, "devServer");
	}
	if (webpackProperties) {
		if (action === "init" && typeof webpackProperties === "object") {
			return ast
				.find(j.ObjectExpression)
				.filter(p => utils.isAssignment(null, p, createDevServerProperty));
		} else if (action === "init" && webpackProperties.length) {
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
		} else if (action === "add") {
			if (utils.findRootNodesByName(j, ast, "devServer").size() !== 0) {
				return ast
					.find(j.ObjectExpression)
					.filter(p =>
						utils.pushObjectKeys(j, p, webpackProperties, "devServer")
					);
			} else {
				return devServerTransform(j, ast, webpackProperties, "init");
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
